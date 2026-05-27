import type { ETBDemoDetail } from "@/data/work";

const A = "/assets/atomicos-demo";

/** "View full details" content for AtomicOS — built from the "Check On Me
 *  Every Hour" app. */
export const ATOMICOS_DEMO: ETBDemoDetail = {
  summary:
    "“Check On Me Every Hour” is the check-in engine behind AtomicOS — a personal operating system that turns daily intentions into a measurable system. It tracks habits and streaks, when things actually get done, calories and weight, journaling, and the interaction effects between behaviors, all surfaced through a clean analytics dashboard and an automated bot that checks in throughout the day and parses natural-language replies into structured data.",
  screenshots: [
    {
      src: `${A}/atomicos-overview.webp`,
      alt: "AtomicOS dashboard overview showing today's habits, energy, sleep, last check-in, and last meal.",
      caption:
        "Daily dashboard — today's habits, energy, sleep, last check-in, and last meal at a glance.",
      width: 2912,
      height: 1470,
      mobileSrc: `${A}/atomicos-overview-mobile.webp`,
      mobileWidth: 750,
      mobileHeight: 3640,
    },
    {
      src: `${A}/atomicos-habits.png`,
      alt: "60-day habit completion grid with current streaks for each habit.",
      caption: "60-day completion grid with live streaks across every tracked habit.",
      width: 2912,
      height: 1384,
      mobileSrc: `${A}/atomicos-habits-mobile.webp`,
      mobileWidth: 750,
      mobileHeight: 1456,
    },
    {
      src: `${A}/atomicos-heatmap.webp`,
      alt: "Activity heatmap of habit completions across hours and weekdays, with peak hour and peak day.",
      caption:
        "Activity heatmap — when habits and routines actually get done across hours and weekdays.",
      width: 2912,
      height: 850,
      mobileSrc: `${A}/atomicos-heatmap-mobile.webp`,
      mobileWidth: 750,
      mobileHeight: 1478,
    },
    {
      src: `${A}/atomicos-loop-drivers.webp`,
      alt: "Loop drivers chart showing which habits make each daily routine more or less likely to close.",
      caption:
        "Loop drivers — which habits make each routine more or less likely to close.",
      width: 2912,
      height: 1520,
      mobileSrc: `${A}/atomicos-loop-drivers-mobile.webp`,
      mobileWidth: 750,
      mobileHeight: 2916,
    },
    {
      src: `${A}/atomicos-checkins.webp`,
      alt: "Check-in analytics showing response rate, average latency, and a log of recent replies.",
      caption: "Check-in analytics — response rate, latency, and a log of recent replies.",
      width: 2912,
      height: 1930,
      mobileSrc: `${A}/atomicos-checkins-mobile.webp`,
      mobileWidth: 750,
      mobileHeight: 2446,
    },
    {
      src: `${A}/atomicos-checkin-thread.webp`,
      alt: "Phone mock of the AtomicOS Telegram check-in thread with tap-to-track inline buttons.",
      caption:
        "The “Check On Me Every Hour” thread — automated Telegram check-ins with tap-to-track replies.",
      width: 880,
      height: 3206,
      variant: "phone",
    },
  ],
  techBreakdown: [
    "Next.js 15 and React 19 dashboard, styled with Tailwind; analytics views render with Recharts.",
    "Supabase (Postgres) backs habits, check-ins, meals, weight, and journal entries; Edge Functions run the server-side check-in bot.",
    "A Telegram bot delivers timed check-ins and parses natural-language replies into structured habit, finance, and health data.",
    "A synthetic-data mode generates all sample content client-side, so the publicly shareable build never touches a real database.",
  ],
  outcomes: [
    "A single operating view that turns scattered daily behavior into structured, trackable signals.",
    "Interaction-effect insights surface non-obvious patterns — e.g., in the sample data, Deep Work runs ~22% higher the day after a Sleep Wind-Down.",
    "Low-friction logging: check-ins reach an 88% response rate in the sample data, with most entries captured in a few taps.",
  ],
  lessonsLearned: [
    "Defaulting to synthetic data unless real credentials are explicitly provided makes the build safe to share publicly by design.",
    "Natural-language check-ins lower the friction of logging far more than forms; parsing reliability is the hard part.",
    "Surfacing interaction effects is where the data gets genuinely useful — raw streaks alone don't change behavior.",
  ],
};
