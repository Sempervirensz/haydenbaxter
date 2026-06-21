/* ===========================================================================
   TEMPORARY BIRTHDAY PAGE: remove after Kemmerlee's birthday.

   Private, unlisted route — not linked from nav, footer, sitemap, or homepage.
   To remove later: delete the whole `src/app/happybirthdaykemmerlee/` folder
   and the three assets in `public/images/` (happy-birthday-kemmerlee.png,
   kemmerlee-stars.mp4, kemmerlee-stars-poster.png).
   =========================================================================== */

import type { Metadata } from "next";
import BirthdayExperience from "./BirthdayExperience";
import "./birthday.css";

// Keep search engines out of this private page.
export const metadata: Metadata = {
  title: "A Birthday Surprise",
  robots: { index: false, follow: false },
};

/* ---------------------------------------------------------------------------
   Optional expiration.
   Set the env var BIRTHDAY_PAGE_EXPIRES_AT (any value `new Date()` accepts,
   e.g. "2026-07-15T23:59:59-06:00") to auto-retire the page after that time.
   Or hard-code a date in the constant below instead. Leave both empty/null
   and the page simply never expires.
   --------------------------------------------------------------------------- */
const BIRTHDAY_PAGE_EXPIRES_AT: string | null =
  process.env.BIRTHDAY_PAGE_EXPIRES_AT ?? null;

function isExpired(): boolean {
  if (!BIRTHDAY_PAGE_EXPIRES_AT) return false;
  const expires = new Date(BIRTHDAY_PAGE_EXPIRES_AT);
  if (Number.isNaN(expires.getTime())) return false; // bad value → never break the page
  return Date.now() > expires.getTime();
}

export default function HappyBirthdayKemmerleePage() {
  if (isExpired()) {
    return (
      <main className="bk-root">
        <div className="bk-glow bk-glow--moon" aria-hidden="true" />
        <div className="bk-glow bk-glow--planet" aria-hidden="true" />
        <div className="bk-ended">
          <h1 className="bk-ended__title">This birthday adventure has ended.</h1>
        </div>
      </main>
    );
  }

  return <BirthdayExperience />;
}
