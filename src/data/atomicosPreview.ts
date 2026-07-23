// AtomicOS preview — mock data only (no backend)

export const ATOMICOS_HERO = {
  name: "AtomicOS",
  tagline: "A personal AI operating system for turning goals into action",
  description:
    "AtomicOS helps you organize priorities, track progress, and manage tasks in one place—then routes the right work to focused AI agents so you stay aligned with your goals, not your inbox.",
};

export const ATOMICOS_PRIORITIES = [
  { id: "p1", label: "Finish capstone research draft" },
  { id: "p2", label: "Send two targeted applications" },
  { id: "p3", label: "Ship landing copy for side project" },
];

export const ATOMICOS_GOALS = [
  { id: "g1", label: "Graduate program — Chapter 2 submitted", progress: 72 },
  { id: "g2", label: "Job search — 5 quality apps / week", progress: 60 },
  { id: "g3", label: "Startup MVP — first paying user", progress: 38 },
];

export const ATOMICOS_DEADLINES = [
  { id: "d1", label: "Literature review outline", when: "Today · 4:00 PM", scope: "School" },
  { id: "d2", label: "Follow-up: hiring manager (Logistics Co.)", when: "Mon · 10:00 AM", scope: "Job search" },
  { id: "d3", label: "Pitch deck v2 review", when: "Wed · EOD", scope: "Startup" },
  { id: "d4", label: "Gym + meal prep block", when: "Sat · 6:00 AM", scope: "Personal" },
];

export const ATOMICOS_ASSISTANT = {
  title: "Assistant",
  status: "Ready",
  suggestions: [
    "What should I cut from today if I only have 3 hours?",
    "Summarize my waiting items by risk.",
    "Reschedule deep work to match my best focus window.",
  ],
  lastReply:
    "You have three high-leverage items before noon. I suggest blocking 9:00–11:00 for the capstone draft, then one application before lunch. Want me to rebuild your day around that?",
};

export const ATOMICOS_QUICK_ACTIONS = [
  { id: "qa1", label: "Plan My Day" },
  { id: "qa2", label: "Summarize Tasks" },
  { id: "qa3", label: "Run Focus Check" },
] as const;

export type TaskColumn = "today" | "week" | "waiting" | "done";

export interface AtomicTask {
  id: string;
  title: string;
  column: TaskColumn;
  context: "School" | "Job search" | "Startup" | "Personal";
}

export const ATOMICOS_TASKS: AtomicTask[] = [
  { id: "t1", title: "Office hours: ML survey questions", column: "today", context: "School" },
  { id: "t2", title: "Tailor resume → Product Analyst @ Northwind", column: "today", context: "Job search" },
  { id: "t3", title: "Wire pricing section on marketing site", column: "today", context: "Startup" },
  { id: "t4", title: "Compile bib references for related work", column: "week", context: "School" },
  { id: "t5", title: "Recruiter screen prep (behavioral stories)", column: "week", context: "Job search" },
  { id: "t6", title: "Analytics event schema for onboarding funnel", column: "week", context: "Startup" },
  { id: "t7", title: "Waiting on advisor feedback: Chapter 1", column: "waiting", context: "School" },
  { id: "t8", title: "Background check form — vendor portal", column: "waiting", context: "Job search" },
  { id: "t9", title: "Logo export from designer", column: "waiting", context: "Startup" },
  { id: "t10", title: "Morning run + sleep log (3-day streak)", column: "done", context: "Personal" },
  { id: "t11", title: "Inbox zero + weekly plan ritual", column: "done", context: "Personal" },
  { id: "t12", title: "Submit problem set 7", column: "done", context: "School" },
];

export const ATOMICOS_AGENTS = [
  {
    id: "a1",
    name: "Career Agent",
    status: "Active",
    currentTask: "Rank this week’s networking targets",
    nextAction: "Draft a 4-line follow-up to the last recruiter note",
  },
  {
    id: "a2",
    name: "Study Agent",
    status: "Focused",
    currentTask: "Break capstone into 25m pomodoros",
    nextAction: "Generate flashcards from today’s reading notes",
  },
  {
    id: "a3",
    name: "Health Routine Agent",
    status: "Monitoring",
    currentTask: "Track sleep, protein, and training volume",
    nextAction: "Shift workout to 7:00 AM based on your calendar",
  },
  {
    id: "a4",
    name: "Project Builder Agent",
    status: "Building",
    currentTask: "Spec API routes for user settings",
    nextAction: "List top 3 scope cuts if ship date is fixed",
  },
] as const;

export const ATOMICOS_INSIGHTS = {
  momentum: "You closed 19 tasks this week (+14% vs last week). Momentum is highest Tue–Thu.",
  patterns: [
    "Your highest-output blocks cluster before noon.",
    "“Waiting” items spike after long meetings—consider shorter syncs on heavy days.",
    "You move startup tasks faster when they’re under 25 minutes on the board.",
  ],
  suggestion:
    "Your highest-output blocks happen before noon. Move deep work earlier and default meetings to 2:00+ PM.",
};

export const ATOMICOS_FOCUS = {
  score: 78,
  label: "Strong",
  hint: "Clear top 3, single theme per block, phones away during deep work.",
};
