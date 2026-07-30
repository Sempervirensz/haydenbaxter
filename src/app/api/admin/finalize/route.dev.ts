import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);
const JOURNAL_PATHS = ["src/data/journal.ts", "public/images/blog"];

type Body = {
  message?: string;
  push?: boolean;
};

async function run(command: string, args: string[]) {
  try {
    return await execFileAsync(command, args, {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 8,
    });
  } catch (err) {
    if (err && typeof err === "object" && "stderr" in err) {
      const e = err as { stderr?: string; stdout?: string; message?: string };
      throw new Error((e.stderr || e.stdout || e.message || "Command failed").trim());
    }
    throw err;
  }
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, error: "Disabled outside dev" }, { status: 404 });
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message || "blog: journal updates").trim();
  if (!message) {
    return NextResponse.json({ ok: false, error: "Commit message is required" }, { status: 400 });
  }

  const status = await run("git", ["status", "--short", "--", ...JOURNAL_PATHS]);
  if (!status.stdout.trim()) {
    return NextResponse.json(
      { ok: false, error: "No Journal changes to commit." },
      { status: 409 },
    );
  }

  await run("git", ["add", "--", ...JOURNAL_PATHS]);
  await run("npm", ["run", "check"]);

  const staged = await execFileAsync("git", ["diff", "--cached", "--quiet"], {
    cwd: process.cwd(),
  }).then(
    () => false,
    () => true,
  );
  if (!staged) {
    return NextResponse.json(
      { ok: false, error: "No staged Journal changes to commit." },
      { status: 409 },
    );
  }

  await run("git", ["commit", "-m", message]);

  const branchResult = await run("git", ["branch", "--show-current"]);
  const branch = branchResult.stdout.trim();
  if (!branch) {
    return NextResponse.json(
      { ok: false, error: "Cannot push from a detached HEAD." },
      { status: 409 },
    );
  }

  let pushed = false;
  if (body.push !== false) {
    await run("git", ["push", "origin", branch]);
    pushed = true;
  }

  const commitResult = await run("git", ["rev-parse", "--short", "HEAD"]);

  return NextResponse.json({
    ok: true,
    branch,
    commit: commitResult.stdout.trim(),
    pushed,
  });
}
