"use client"
import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import type { GlobeCue } from "@/data/scLab"

interface JourneyDot {
  coords: [number, number]
  label: string
  selected?: boolean
}

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
  autoRotate?: boolean
  initialRotation?: [number, number]
  showPulseDots?: [number, number][]
  showArcs?: { from: [number, number]; to: [number, number] }[]
  transparentBg?: boolean
  cue?: GlobeCue
  /** Clickable journey dots */
  journeyDots?: JourneyDot[]
  /** Index of selected journey dot */
  selectedDot?: number
  /** Arcs to draw between journey dots (by index), only up to selected */
  journeyArcs?: { from: number; to: number }[]
  /** Called when a journey dot is clicked */
  onDotClick?: (index: number) => void
  /** When true, disables drag-to-rotate and scroll-to-zoom (globe still responds to selectedDot) */
  frozen?: boolean
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpAngle(a: number, b: number, t: number) {
  let diff = b - a
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return a + diff * t
}

// Ease-out cubic for smoother deceleration
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
  autoRotate: autoRotateProp = true,
  initialRotation,
  showPulseDots,
  showArcs,
  transparentBg = false,
  cue,
  journeyDots,
  selectedDot,
  journeyArcs,
  onDotClick,
  frozen = false,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cueRef = useRef(cue)
  const pulsDotsRef = useRef(showPulseDots)
  const arcsRef = useRef(showArcs)
  const autoRotateRef = useRef(autoRotateProp)
  const journeyDotsRef = useRef(journeyDots)
  const selectedDotRef = useRef(selectedDot)
  const journeyArcsRef = useRef(journeyArcs)
  const onDotClickRef = useRef(onDotClick)
  const frozenRef = useRef(frozen)

  useEffect(() => { cueRef.current = cue }, [cue])
  useEffect(() => { frozenRef.current = frozen }, [frozen])
  useEffect(() => { pulsDotsRef.current = showPulseDots }, [showPulseDots])
  useEffect(() => { arcsRef.current = showArcs }, [showArcs])
  useEffect(() => { autoRotateRef.current = autoRotateProp }, [autoRotateProp])
  useEffect(() => { journeyDotsRef.current = journeyDots }, [journeyDots])
  useEffect(() => { selectedDotRef.current = selectedDot }, [selectedDot])
  useEffect(() => { journeyArcsRef.current = journeyArcs }, [journeyArcs])
  useEffect(() => { onDotClickRef.current = onDotClick }, [onDotClick])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const parentWidth = canvas.parentElement?.clientWidth || window.innerWidth - 40
    const containerWidth = Math.min(width, parentWidth, window.innerWidth - 40)
    const containerHeight = Math.min(height, window.innerHeight - 100)
    const baseRadius = Math.min(containerWidth, containerHeight) / 2.5
    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(baseRadius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }
      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry
      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates
        if (!pointInPolygon(point, coordinates[0])) return false
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true
                break
              }
            }
            if (!inHole) return true
          }
        }
        return false
      }
      return false
    }

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      const stepSize = dotSpacing * 0.08
      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat]
          if (pointInFeature(point, feature)) {
            dots.push(point)
          }
        }
      }
      return dots
    }

    interface DotData { lng: number; lat: number; visible: boolean }
    const allDots: DotData[] = []
    let landFeatures: any
    let frameCount = 0

    // --- Animated state ---
    const currentRotation = initialRotation ? [-initialRotation[0], -initialRotation[1]] : [0, 0]
    let currentZoom = 1
    let targetRotation = [...currentRotation]
    let targetZoom = 1
    let currentArcProgress = 0
    let targetArcProgress = 0
    let currentIntensity = 0.4
    let targetIntensity = 0.4
    let activePulseDots: { coords: [number, number]; label: string }[] = []
    let activeArcs: { from: [number, number]; to: [number, number] }[] = []
    // For non-cue modes, convert simple coords to labeled dots
    let simpleActivePulseDots: [number, number][] = pulsDotsRef.current || []
    let simpleActiveArcs: { from: [number, number]; to: [number, number] }[] = arcsRef.current || []
    let isDragging = false
    // Transition progress for ease-out (0–1, resets on new cue)
    let transitionT = 1
    let transitionFrom = [...currentRotation]
    let transitionZoomFrom = 1

    projection.rotate(currentRotation as [number, number])

    function applyCue(c: GlobeCue) {
      // Snapshot current state for ease-out transition
      transitionFrom = [...currentRotation]
      transitionZoomFrom = currentZoom
      transitionT = 0
      targetRotation = [-c.rotation[0], -c.rotation[1]]
      targetZoom = c.zoom
      targetIntensity = c.intensity
      activePulseDots = c.pulseDots
      activeArcs = c.arcs
      targetArcProgress = c.arcProgress
    }

    if (cueRef.current) applyCue(cueRef.current)

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const currentScale = projection.scale()
      const scaleFactor = currentScale / baseRadius
      const intensity = currentIntensity

      // Draw ocean
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      if (!transparentBg) {
        context.fillStyle = "#000000"
        context.fill()
      }
      context.strokeStyle = "#ffffff"
      context.lineWidth = 2 * scaleFactor
      context.globalAlpha = (transparentBg ? 0.3 : 1) * intensity
      context.stroke()
      context.globalAlpha = 1

      if (landFeatures) {
        // Draw graticule
        const graticule = d3.geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = "#ffffff"
        context.lineWidth = 1 * scaleFactor
        context.globalAlpha = 0.15 * intensity
        context.stroke()
        context.globalAlpha = 1

        // Draw land outlines
        context.beginPath()
        landFeatures.features.forEach((feature: any) => {
          path(feature)
        })
        context.strokeStyle = "#ffffff"
        context.lineWidth = 1 * scaleFactor
        context.globalAlpha = 0.7 * intensity + 0.3
        context.stroke()

        // Draw halftone dots
        context.globalAlpha = 0.5 * intensity + 0.3
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerWidth &&
            projected[1] >= 0 &&
            projected[1] <= containerHeight
          ) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = "#999999"
            context.fill()
          }
        })
        context.globalAlpha = 1

        // --- Connection arcs with traveling particles ---
        const allArcs = cueRef.current ? activeArcs : simpleActiveArcs
        if (allArcs.length > 0 && currentArcProgress > 0.01) {
          allArcs.forEach((arc, arcIdx) => {
            const interpolator = d3.geoInterpolate(arc.from, arc.to)
            const pulseAlpha = 0.4 + 0.4 * Math.abs(Math.sin(frameCount * 0.02 + arcIdx * 0.8))
            const drawTo = currentArcProgress

            // Main arc line
            context.beginPath()
            let started = false
            for (let t = 0; t <= drawTo; t += 0.02) {
              const point = interpolator(t)
              const projected = projection(point)
              if (projected) {
                if (!started) { context.moveTo(projected[0], projected[1]); started = true }
                else context.lineTo(projected[0], projected[1])
              }
            }
            context.strokeStyle = "#ffffff"
            context.lineWidth = 2 * scaleFactor
            context.globalAlpha = pulseAlpha * currentArcProgress * intensity
            context.stroke()

            // Arc glow
            context.lineWidth = 8 * scaleFactor
            context.globalAlpha = pulseAlpha * 0.08 * currentArcProgress * intensity
            context.stroke()
            context.globalAlpha = 1

            // Traveling particle along arc
            if (currentArcProgress > 0.1) {
              const particleT = ((frameCount * 0.008 + arcIdx * 0.33) % 1)
              if (particleT <= drawTo) {
                const particlePoint = interpolator(particleT)
                const projected = projection(particlePoint)
                if (projected) {
                  // Particle outer glow
                  context.beginPath()
                  context.arc(projected[0], projected[1], 8 * scaleFactor, 0, 2 * Math.PI)
                  context.fillStyle = "#ffffff"
                  context.globalAlpha = 0.12 * intensity
                  context.fill()
                  // Particle core
                  context.beginPath()
                  context.arc(projected[0], projected[1], 3 * scaleFactor, 0, 2 * Math.PI)
                  context.globalAlpha = 0.9 * intensity
                  context.fill()
                  context.globalAlpha = 1
                }
              }
            }
          })
        }

        // --- Pulse dots with labels ---
        const dotsToRender = cueRef.current
          ? activePulseDots
          : simpleActivePulseDots.map((c) => ({ coords: c, label: "" }))

        if (dotsToRender.length > 0) {
          dotsToRender.forEach((dot, i) => {
            const projected = projection(dot.coords)
            if (projected) {
              const pulsePhase = frameCount * 0.03 + i * 2.1
              const pulseSize = 3 + 1.5 * Math.sin(pulsePhase)
              const pulseAlpha = (0.5 + 0.5 * Math.sin(pulsePhase)) * intensity

              // Outer ring
              context.beginPath()
              context.arc(projected[0], projected[1], (pulseSize + 8) * scaleFactor, 0, 2 * Math.PI)
              context.strokeStyle = "#ffffff"
              context.lineWidth = 1 * scaleFactor
              context.globalAlpha = pulseAlpha * 0.15
              context.stroke()

              // Mid glow
              context.beginPath()
              context.arc(projected[0], projected[1], (pulseSize + 4) * scaleFactor, 0, 2 * Math.PI)
              context.fillStyle = "#ffffff"
              context.globalAlpha = pulseAlpha * 0.12
              context.fill()

              // Core dot
              context.beginPath()
              context.arc(projected[0], projected[1], pulseSize * scaleFactor, 0, 2 * Math.PI)
              context.globalAlpha = pulseAlpha * 0.85
              context.fill()
              context.globalAlpha = 1

              // Country label
              if (dot.label) {
                context.font = `${9 * scaleFactor}px monospace`
                context.fillStyle = "#ffffff"
                context.globalAlpha = pulseAlpha * 0.7
                context.textAlign = "left"
                context.textBaseline = "middle"
                const labelX = projected[0] + (pulseSize + 12) * scaleFactor
                const labelY = projected[1]
                // Label background
                const metrics = context.measureText(dot.label)
                const pad = 3 * scaleFactor
                context.fillStyle = "rgba(0,0,0,0.5)"
                context.globalAlpha = pulseAlpha * 0.5
                context.fillRect(
                  labelX - pad,
                  labelY - 5 * scaleFactor - pad,
                  metrics.width + pad * 2,
                  10 * scaleFactor + pad * 2,
                )
                // Label text
                context.fillStyle = "#ffffff"
                context.globalAlpha = pulseAlpha * 0.7
                context.fillText(dot.label, labelX, labelY)
                context.globalAlpha = 1
              }
            }
          })
        }

        // --- Journey dots (clickable waypoints) ---
        const jDots = journeyDotsRef.current
        const jSelected = selectedDotRef.current
        const jArcs = journeyArcsRef.current

        if (jDots && jDots.length > 0) {
          // Draw journey arcs (only up to selected stop)
          if (jArcs && jSelected !== undefined && jSelected > 0) {
            jArcs.forEach((arc) => {
              if (arc.to > jSelected) return // only draw arcs up to selected
              const fromCoords = jDots[arc.from]?.coords
              const toCoords = jDots[arc.to]?.coords
              if (!fromCoords || !toCoords) return

              const interpolator = d3.geoInterpolate(fromCoords, toCoords)
              const pulseAlpha = 0.5 + 0.3 * Math.abs(Math.sin(frameCount * 0.015))

              // Arc line
              context.beginPath()
              let started = false
              for (let t = 0; t <= 1; t += 0.02) {
                const point = interpolator(t)
                const proj = projection(point)
                if (proj) {
                  if (!started) { context.moveTo(proj[0], proj[1]); started = true }
                  else context.lineTo(proj[0], proj[1])
                }
              }
              context.strokeStyle = "#ffffff"
              context.lineWidth = 1.5 * scaleFactor
              context.globalAlpha = pulseAlpha * 0.6
              context.stroke()

              // Glow
              context.lineWidth = 6 * scaleFactor
              context.globalAlpha = pulseAlpha * 0.06
              context.stroke()
              context.globalAlpha = 1

              // Traveling particle
              const particleT = ((frameCount * 0.006 + arc.from * 0.25) % 1)
              const particlePoint = interpolator(particleT)
              const proj = projection(particlePoint)
              if (proj) {
                context.beginPath()
                context.arc(proj[0], proj[1], 3 * scaleFactor, 0, 2 * Math.PI)
                context.fillStyle = "#ffffff"
                context.globalAlpha = 0.8
                context.fill()
                context.globalAlpha = 1
              }
            })
          }

          // Draw journey dots
          journeyDotProjections.length = 0
          jDots.forEach((dot, i) => {
            const projected = projection(dot.coords)
            if (!projected) {
              journeyDotProjections.push(null)
              return
            }
            journeyDotProjections.push(projected as [number, number])

            const isSelected = jSelected === i
            const isVisited = jSelected !== undefined && i <= jSelected
            const pulsePhase = frameCount * 0.025 + i * 1.5
            const baseSize = isSelected ? 6 : 4
            const pulseSize = baseSize + (isSelected ? 2 * Math.sin(pulsePhase) : 0)

            // Outer glow for selected
            if (isSelected) {
              context.beginPath()
              context.arc(projected[0], projected[1], (pulseSize + 12) * scaleFactor, 0, 2 * Math.PI)
              context.fillStyle = "#ffffff"
              context.globalAlpha = 0.06 + 0.04 * Math.sin(pulsePhase)
              context.fill()
            }

            // Dot ring
            context.beginPath()
            context.arc(projected[0], projected[1], (pulseSize + 3) * scaleFactor, 0, 2 * Math.PI)
            context.strokeStyle = "#ffffff"
            context.lineWidth = 1.5 * scaleFactor
            context.globalAlpha = isVisited ? 0.7 : 0.25
            context.stroke()

            // Dot core
            context.beginPath()
            context.arc(projected[0], projected[1], pulseSize * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = isSelected ? "#ffffff" : isVisited ? "#cccccc" : "#666666"
            context.globalAlpha = isSelected ? 0.95 : isVisited ? 0.7 : 0.35
            context.fill()
            context.globalAlpha = 1

            // Label
            context.font = `bold ${10 * scaleFactor}px monospace`
            context.textAlign = "left"
            context.textBaseline = "middle"
            const labelX = projected[0] + (pulseSize + 8) * scaleFactor
            const labelY = projected[1]
            // Background
            const metrics = context.measureText(dot.label)
            const pad = 4 * scaleFactor
            context.fillStyle = "rgba(0,0,0,0.6)"
            context.globalAlpha = isVisited ? 0.7 : 0.3
            context.fillRect(
              labelX - pad,
              labelY - 6 * scaleFactor - pad,
              metrics.width + pad * 2,
              12 * scaleFactor + pad * 2,
            )
            // Text
            context.fillStyle = "#ffffff"
            context.globalAlpha = isSelected ? 0.95 : isVisited ? 0.6 : 0.25
            context.fillText(dot.label, labelX, labelY)
            context.globalAlpha = 1
          })
        }
      }
    }

    // Store projected positions for hit detection
    let journeyDotProjections: ([number, number] | null)[] = []

    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json",
        )
        if (!response.ok) throw new Error("Failed to load land data")
        landFeatures = await response.json()
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16)
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat, visible: true })
          })
        })
        render()
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load land map data")
        setIsLoading(false)
      }
    }

    const TRANSITION_SPEED = 0.012 // ~83 frames ≈ 1.4s for full transition

    const animate = () => {
      frameCount++

      const latestCue = cueRef.current
      if (latestCue) {
        const newTarget = [-latestCue.rotation[0], -latestCue.rotation[1]]
        if (Math.abs(newTarget[0] - targetRotation[0]) > 0.5 ||
            Math.abs(newTarget[1] - targetRotation[1]) > 0.5 ||
            Math.abs(latestCue.zoom - targetZoom) > 0.01 ||
            Math.abs(latestCue.intensity - targetIntensity) > 0.01) {
          applyCue(latestCue)
        }
      }

      if (!cueRef.current) {
        const refDots = pulsDotsRef.current
        if (refDots) simpleActivePulseDots = refDots
        const refArcs = arcsRef.current
        if (refArcs) simpleActiveArcs = refArcs
      }

      // Journey dot selection drives rotation
      const jDots = journeyDotsRef.current
      const jSel = selectedDotRef.current
      if (jDots && jSel !== undefined && jDots[jSel]) {
        const targetCoords = jDots[jSel].coords
        const newTarget = [-targetCoords[0], -targetCoords[1]]
        if (Math.abs(newTarget[0] - targetRotation[0]) > 0.5 ||
            Math.abs(newTarget[1] - targetRotation[1]) > 0.5) {
          transitionFrom = [...currentRotation]
          transitionZoomFrom = currentZoom
          transitionT = 0
          targetRotation = newTarget
          targetZoom = 1.3
        }
      }

      if (!isDragging) {
        if (cueRef.current) {
          // Advance transition progress
          if (transitionT < 1) {
            transitionT = Math.min(1, transitionT + TRANSITION_SPEED)
          }
          const easedT = easeOutCubic(transitionT)

          // Smooth rotation via eased interpolation
          currentRotation[0] = lerpAngle(transitionFrom[0], targetRotation[0], easedT)
          currentRotation[1] = lerp(transitionFrom[1], targetRotation[1], easedT)
          currentZoom = lerp(transitionZoomFrom, targetZoom, easedT)
          // Intensity and arc progress use continuous lerp for fluid feel
          currentIntensity = lerp(currentIntensity, targetIntensity, 0.03)
          currentArcProgress = lerp(currentArcProgress, targetArcProgress, 0.025)
        } else if (jDots && jSel !== undefined) {
          // Journey mode: use eased transition
          if (transitionT < 1) {
            transitionT = Math.min(1, transitionT + TRANSITION_SPEED)
          }
          const easedT = easeOutCubic(transitionT)
          currentRotation[0] = lerpAngle(transitionFrom[0], targetRotation[0], easedT)
          currentRotation[1] = lerp(transitionFrom[1], targetRotation[1], easedT)
          currentZoom = lerp(transitionZoomFrom, targetZoom, easedT)
          currentIntensity = lerp(currentIntensity, 0.8, 0.02)
        } else if (autoRotateRef.current) {
          currentRotation[0] += 0.3
          currentIntensity = lerp(currentIntensity, 0.7, 0.01)
        }

        projection.rotate(currentRotation as [number, number])
        projection.scale(baseRadius * currentZoom)
      }

      render()
    }

    const rotationTimer = d3.timer(animate)

    const handleMouseDown = (event: MouseEvent) => {
      // Check journey dot click first
      if (journeyDotProjections.length > 0 && onDotClickRef.current) {
        const rect = canvas.getBoundingClientRect()
        const clickX = (event.clientX - rect.left)
        const clickY = (event.clientY - rect.top)
        const hitRadius = 18
        for (let i = 0; i < journeyDotProjections.length; i++) {
          const proj = journeyDotProjections[i]
          if (!proj) continue
          const dx = clickX - proj[0]
          const dy = clickY - proj[1]
          if (dx * dx + dy * dy < hitRadius * hitRadius) {
            onDotClickRef.current(i)
            return // don't start drag
          }
        }
      }

      // When frozen, only allow dot clicks (handled above), no drag
      if (frozenRef.current) return

      isDragging = true
      const startX = event.clientX
      const startY = event.clientY
      const startRotation = [...currentRotation]
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.5
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        currentRotation[0] = startRotation[0] + dx * sensitivity
        currentRotation[1] = startRotation[1] - dy * sensitivity
        currentRotation[1] = Math.max(-90, Math.min(90, currentRotation[1]))
        projection.rotate(currentRotation as [number, number])
        render()
      }
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        // Snapshot current position for smooth resume
        transitionFrom = [...currentRotation]
        transitionZoomFrom = currentZoom
        transitionT = 0.8 // Nearly there, smooth pickup
        setTimeout(() => { isDragging = false }, 10)
      }
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    const handleWheel = (event: WheelEvent) => {
      if (frozenRef.current) return
      event.preventDefault()
      const sf = event.deltaY > 0 ? 0.9 : 1.1
      currentZoom = Math.max(0.5, Math.min(3, currentZoom * sf))
      targetZoom = currentZoom
      transitionZoomFrom = currentZoom
      projection.scale(baseRadius * currentZoom)
      render()
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging || journeyDotProjections.length === 0) return
      const rect = canvas.getBoundingClientRect()
      const mx = event.clientX - rect.left
      const my = event.clientY - rect.top
      let overDot = false
      for (const proj of journeyDotProjections) {
        if (!proj) continue
        const dx = mx - proj[0]
        const dy = my - proj[1]
        if (dx * dx + dy * dy < 18 * 18) { overDot = true; break }
      }
      canvas.style.cursor = overDot ? "pointer" : frozenRef.current ? "default" : "grab"
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("wheel", handleWheel)
    loadWorldData()

    return () => {
      rotationTimer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("wheel", handleWheel)
    }
  }, [width, height, transparentBg, initialRotation])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-neutral-900 rounded-2xl p-8 ${className}`}>
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-2">Error loading Earth visualization</p>
          <p className="text-neutral-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        className={`w-full h-auto ${transparentBg ? "" : "rounded-2xl bg-black"}`}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  )
}
