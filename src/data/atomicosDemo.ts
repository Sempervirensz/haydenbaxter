import type { ETBDemoDetail } from "@/data/work";

const A = "/assets/atomicos-demo";

/** "View full details" content for AtomicOS, a behavior-intelligence system
 *  that turns natural-language chat check-ins into structured habit data
 *  and surfaces which routines appear to drive better days. */
export const ATOMICOS_DEMO: ETBDemoDetail = {
  heroCategory: "Behavior Intelligence",
  story: [
    "I kept quitting habit trackers for the same reason most people do: logging eventually became more work than the habit itself.",
    "So I built the opposite.",
    "AtomicOS checks in through a chat bot throughout the day. I reply in plain English, something as simple as “morning walk done, felt like an eight,” and the system identifies the habit, timing, energy level, and other useful details automatically.",
    "The dashboard then goes beyond streaks and completion counts. It looks for relationships between behaviors to reveal which routines appear to improve focus, energy, and follow-through.",
  ],
  principle:
    "Remove friction where the person has to act, and put intelligence where it earns its keep.",
  stats: [
    {
      value: "60d",
      label: "Demo history",
      detail:
        "Deterministic behavioral data designed to demonstrate long-term patterns safely.",
      icon: "calendar",
    },
    {
      value: "22",
      label: "Behaviors modeled",
      detail:
        "Habits, routines, health signals, work patterns, and daily actions.",
      icon: "checklist",
    },
    {
      value: "4",
      label: "Daily loops",
      detail:
        "Morning, work, evening, and night routines analyzed as connected systems.",
      icon: "spark",
    },
    {
      value: "2",
      label: "Input modes",
      detail: "Natural-language check-ins and meal-photo analysis.",
      icon: "bot",
    },
  ],
  // Screenshots are ordered to tell one story:
  //   natural conversation -> structured data -> behavioral insights.
  // TODO(screenshot): a dedicated "interaction effects" capture belongs
  // between "Loop drivers" and the activity heatmap (relationships between
  // behaviors, e.g. deep work after a wind-down). Add the asset + a slide
  // here when it exists rather than inserting a broken image.
  screenshots: [
    {
      src: `${A}/atomicos-checkin-thread.webp`,
      alt: "Phone mock of the AtomicOS chat check-in thread with tap-to-track inline buttons.",
      caption:
        "A conversational interface replaces the traditional habit-tracking form.",
      width: 880,
      height: 3206,
      variant: "phone",
    },
    {
      src: `${A}/atomicos-overview.webp`,
      alt: "AtomicOS dashboard overview showing today's habits, energy, sleep, last check-in, and last meal.",
      caption:
        "One operating view turns scattered daily behavior into structured signals.",
      width: 2912,
      height: 1470,
      mobileSrc: `${A}/atomicos-overview-mobile.webp`,
      mobileWidth: 750,
      mobileHeight: 3640,
    },
    {
      src: `${A}/atomicos-loop-drivers.webp`,
      alt: "Loop drivers chart showing which habits make each daily routine more or less likely to close.",
      caption:
        "AtomicOS identifies which habits appear to strengthen each part of the day.",
      width: 2912,
      height: 1520,
      mobileSrc: `${A}/atomicos-loop-drivers-mobile.webp`,
      mobileWidth: 750,
      mobileHeight: 2916,
    },
    {
      src: `${A}/atomicos-heatmap.webp`,
      alt: "Activity heatmap of habit completions across hours and weekdays, with peak hour and peak day.",
      caption:
        "Timing patterns reveal when habits happen, not just whether they happened.",
      width: 2912,
      height: 850,
      mobileSrc: `${A}/atomicos-heatmap-mobile.webp`,
      mobileWidth: 750,
      mobileHeight: 1478,
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
      src: `${A}/atomicos-checkins.webp`,
      alt: "Check-in analytics from the demo dataset showing response rate, average latency, and a log of recent replies.",
      caption:
        "Check-in analytics from the sample dataset: response rate, latency, and a log of recent replies.",
      width: 2912,
      height: 1930,
      mobileSrc: `${A}/atomicos-checkins-mobile.webp`,
      mobileWidth: 750,
      mobileHeight: 2446,
    },
  ],
  howItWorks: [
    {
      title: "It checks in naturally",
      body: "A chat bot sends prompts throughout the day based on routines, priorities, and scheduled behaviors. There is no separate tracking form to maintain.",
    },
    {
      title: "You reply like a person",
      body: "Replies can be casual. AtomicOS converts natural language into structured information such as the completed habit, timestamp, category, and relevant context.",
    },
    {
      title: "It stores the useful signal",
      body: "Simple replies such as “done,” “yes,” or “took it” are handled locally. More ambiguous responses are sent to an AI model for interpretation.",
    },
    {
      title: "It reveals the patterns",
      body: "The dashboard displays habits, streaks, timing, daily loops, and interaction effects between behaviors. Instead of only showing what happened, AtomicOS looks for what may have helped the good days happen.",
    },
  ],
  differentiators: [
    {
      title: "Reply-to-track",
      body: "Users text naturally instead of filling out forms or maintaining another checklist.",
    },
    {
      title: "Loop drivers",
      body: "AtomicOS organizes behavior into four daily loops (morning, work, evening, and night) and identifies which habits appear to strengthen each loop.",
    },
    {
      title: "Interaction effects",
      body: "The system surfaces relationships between behaviors, such as whether deep work appears more consistently after completing a wind-down routine the previous night.",
    },
    {
      title: "Meal-photo analysis",
      body: "Users can send a photograph of a meal and receive an estimated calorie and protein range, which is added to the daily record.",
    },
    {
      title: "Human-centered streak protection",
      body: "A missed day does not automatically erase months of momentum. Freeze logic protects long-running streaks and reflects how people actually behave.",
    },
  ],
  differentiatorsNote:
    "These are directional associations surfaced from the data, not proven causal claims.",
  techSections: [
    {
      title: "Front end",
      body: "AtomicOS uses Next.js 15 and React 19 for the dashboard experience. Tailwind CSS supports the interface system, while Recharts renders behavioral analytics and time-based visualizations.",
    },
    {
      title: "Data layer",
      body: "Supabase and PostgreSQL store habits, check-ins, meal records, weight, journal entries, and related behavioral data. Supabase Edge Functions support server-side automation and the chat check-in workflow.",
    },
    {
      title: "AI and automation",
      body: "A chat bot delivers scheduled prompts and converts natural-language replies into structured behavioral data. Common responses are processed through lightweight local parsing first. Only ambiguous messages are sent to the AI model, reducing unnecessary latency and API cost.",
    },
    {
      title: "Privacy and demo safety",
      body: "The public experience defaults to deterministic synthetic data. Private database fields are transformed into generic display structures before reaching the browser, reducing the risk of exposing personal labels or sensitive records.",
    },
  ],
  // techSections above is the rendered technical breakdown; techBreakdown is
  // kept as a plain-text fallback / summary for any consumer that expects it.
  techBreakdown: [
    "Front end: Next.js 15 and React 19 dashboard styled with Tailwind; analytics render with Recharts.",
    "Data layer: Supabase (Postgres) stores habits, check-ins, meals, weight, and journal entries; Edge Functions run the server-side workflow.",
    "AI and automation: a chat bot parses natural-language replies, with lightweight local parsing first and the AI model reserved for ambiguous messages.",
    "Privacy and demo safety: deterministic synthetic data by default, with private fields transformed into generic display structures before reaching the browser.",
  ],
  outcomes: [
    "Built an end-to-end behavioral system connecting conversational input, scheduled automation, structured storage, analytics, and visual reporting.",
    "Demonstrated how natural-language interaction can reduce the friction that causes people to abandon traditional tracking tools.",
    "Created a privacy-safe, portfolio-ready demo that communicates the product experience without exposing personal health, journal, or financial data.",
  ],
  lessonsLearned: [
    "The best tracking interface may not look like tracking at all. A casual reply is easier to sustain than opening another application and completing a form.",
    "AI should handle ambiguity, not every interaction. Local parsing improved speed, reliability, and cost while preserving AI for the responses that genuinely required interpretation.",
    "Streaks tell you what happened; relationships help explain why. AtomicOS became more valuable when it moved beyond counting habits and started examining how behaviors influence one another.",
  ],
};
