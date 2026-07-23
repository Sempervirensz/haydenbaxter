"use client";

import { useEffect } from "react";

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export default function SiteParallaxEnhancer() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-site-plx-root]");
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      root.classList.add("site-plx--off");
      return;
    }

    interface Item {
      el: HTMLElement;
      scene: HTMLElement;
      x: number;
      y: number;
      scale: number;
      fade: number;
      rot: number;
    }

    let vh = window.innerHeight;
    let items: Item[] = [];
    let ticking = false;

    const collect = () => {
      items = Array.from(
        root.querySelectorAll<HTMLElement>(
          "[data-site-plx-y], [data-site-plx-x], [data-site-plx-scale], [data-site-plx-fade], [data-site-plx-rot]"
        )
      ).flatMap((el) => {
        const scene = el.closest<HTMLElement>("[data-site-plx-scene]");
        if (!scene) return [];
        return [
          {
            el,
            scene,
            x: parseFloat(el.dataset.sitePlxX ?? "0"),
            y: parseFloat(el.dataset.sitePlxY ?? "0"),
            scale: parseFloat(el.dataset.sitePlxScale ?? "0"),
            fade: parseFloat(el.dataset.sitePlxFade ?? "0"),
            rot: parseFloat(el.dataset.sitePlxRot ?? "0"),
          },
        ];
      });
    };

    const update = () => {
      for (const item of items) {
        const rect = item.scene.getBoundingClientRect();
        const span = vh / 2 + rect.height / 2;
        const p = span > 0 ? clamp((rect.top + rect.height / 2 - vh / 2) / span, -1, 1) : 0;
        const away = Math.abs(p);
        const transforms: string[] = [];

        if (item.x || item.y) {
          transforms.push(`translate3d(${p * item.x * vh}px, ${p * item.y * vh}px, 0)`);
        }
        if (item.scale) transforms.push(`scale(${1 - away * item.scale})`);
        if (item.rot) transforms.push(`rotate(${p * item.rot}deg)`);

        item.el.style.transform = transforms.join(" ");
        if (item.fade) item.el.style.opacity = String(1 - away * item.fade);
      }
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const onResize = () => {
      vh = window.innerHeight;
      collect();
      requestUpdate();
    };

    collect();
    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", onResize);
      items.forEach((item) => {
        item.el.style.transform = "";
        item.el.style.opacity = "";
      });
    };
  }, []);

  return null;
}
