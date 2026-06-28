import Link from "next/link";
import "@/components/admin/labs-hub.css";

// Dev-only admin index. Quick links to the local tools.
export default function AdminHome() {
  return (
    <main className="labs">
      <header className="labs__head">
        <div>
          <p className="labs__kicker">Admin · local only</p>
          <h1 className="labs__title">Admin</h1>
          <p className="labs__sub">Local-only tools. Excluded from the production build.</p>
        </div>
      </header>
      <div className="labs__groups">
        <section className="labs__group">
          <h2 className="labs__groupTitle">Tools</h2>
          <ul className="labs__list">
            <li>
              <Link className="labs__item" href="/admin/labs">
                <span className="labs__itemLabel">Labs &amp; tools</span>
                <span className="labs__itemPath">/admin/labs</span>
                <span className="labs__itemNote">Every experiment in one place</span>
              </Link>
            </li>
            <li>
              <Link className="labs__item" href="/admin/preview">
                <span className="labs__itemLabel">Responsive preview</span>
                <span className="labs__itemPath">/admin/preview</span>
                <span className="labs__itemNote">Frame any route at different display sizes</span>
              </Link>
            </li>
            <li>
              <Link className="labs__item" href="/admin/compose">
                <span className="labs__itemLabel">Composer</span>
                <span className="labs__itemPath">/admin/compose</span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
