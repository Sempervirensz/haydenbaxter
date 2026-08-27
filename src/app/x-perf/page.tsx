import type { Metadata } from "next";
import Link from "next/link";
import { PERF_VARIANTS } from "@/data/perfLab";
import "@/components/x-perf/perf-lab.css";

export const metadata: Metadata = {
  title: "Load lab",
  robots: { index: false, follow: false },
};

export default function PerfLabIndex() {
  return (
    <main className="pl-index">
      <p className="pl-index__eyebrow">Load lab · phone only</p>
      <h1 className="pl-index__h1">Which change actually moves the wait?</h1>

      <div className="pl-index__finding">
        <p>
          <b>Measured first, before building this:</b> the entry screen is
          byte-for-byte identical before and after 26 Aug — 2,584&nbsp;KB and 36
          requests either way, same first paint. <b>Today did not make it heavier.</b>
        </p>
        <p>
          What changed is that the splash used to fill the first ~4 seconds. The load
          was always this long; the splash hid it. So two questions below: does cutting
          weight actually help, or was the complaint the blankness rather than the
          duration?
        </p>
      </div>

      <ol className="pl-index__how">
        <li>Use a <b>private tab</b>, on <b>cellular</b>, not wifi.</li>
        <li>Each variant reloads itself 3 times, then shows the median. Don&apos;t touch it while it runs.</li>
        <li>Run <b>Control</b> first and last. If those two disagree, the connection moved and the session is noise.</li>
        <li>Tap <b>Copy result</b> and paste them all back to me.</li>
      </ol>

      <ul className="pl-index__list">
        {PERF_VARIANTS.map((v, i) => (
          <li key={v.id}>
            <Link href={`/x-perf/${v.id}`} className="pl-index__link">
              <span className="pl-index__n">{String(i + 1).padStart(2, "0")}</span>
              <span className="pl-index__body">
                <b>{v.title}</b>
                <em>{v.hypothesis}</em>
                <span className="pl-index__saves">saves {v.saves}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="pl-index__foot">
        Delete this route once the question is settled — it is the only lab that ships.
      </p>
    </main>
  );
}
