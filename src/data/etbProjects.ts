import { WORK_SCREENS, type ETBProject } from "@/data/work";

const ETB_SCREEN = WORK_SCREENS.find(
  (screen): screen is Extract<typeof screen, { type: "emerging-tech-builds" }> =>
    screen.type === "emerging-tech-builds",
);

export function findEtbProject(id: string): ETBProject | null {
  if (!ETB_SCREEN) return null;
  return ETB_SCREEN.etb.projects.find((p) => p.id === id) ?? null;
}
