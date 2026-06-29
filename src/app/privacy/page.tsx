import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { SITE_NAME } from "@/data/site";
import "./privacy.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME}'s portfolio site handles your information.`,
  alternates: { canonical: "/privacy" },
};

const CONTACT_EMAIL = "haydenjbaxter@gmail.com";
const LAST_UPDATED = "June 28, 2026";

export default function PrivacyPage() {
  return (
    <>
      <main className="legal">
        <Link href="/" className="legal__back">
          <span aria-hidden="true">←</span>
          <span>Back to home</span>
        </Link>

        <span className="legal__eyebrow">Legal</span>
        <h1>Privacy Policy</h1>
        <p className="legal__updated">Last updated: {LAST_UPDATED}</p>

        <p>
          This website is the personal portfolio of {SITE_NAME}. It is an
          informational site that showcases work and offers a way to get in
          touch. This policy explains what limited information is involved when
          you visit or contact me, and how it is handled.
        </p>

        <h2>Information collected</h2>
        <ul>
          <li>
            <strong>No accounts, no tracking.</strong> The site has no logins and
            does not use advertising, marketing pixels, or analytics scripts to
            profile visitors.
          </li>
          <li>
            <strong>Server logs.</strong> The site is hosted on Vercel, which, like
            most web hosts, automatically records standard technical request data
            (such as IP address, browser type, and pages requested) for security,
            abuse prevention, and operating the service.
          </li>
          <li>
            <strong>When you book a call.</strong> The “Connect” section embeds{" "}
            <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer">
              Calendly
            </a>{" "}
            to schedule meetings. If you book a time, the details you enter (such
            as your name, email, and any message) are collected and processed by
            Calendly under its own privacy policy.
          </li>
          <li>
            <strong>When you contact me directly.</strong> If you email me or
            connect on LinkedIn, I receive whatever information you choose to
            share in that message.
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>
          The site itself does not set first-party advertising or analytics
          cookies. The embedded Calendly scheduler may set its own cookies within
          its widget to provide the booking experience; those are governed by
          Calendly. Web fonts are self-hosted, so loading the site does not share
          your visit with a font provider.
        </p>

        <h2>How information is used</h2>
        <p>
          Information is used only to respond to your inquiry, schedule and hold
          meetings you request, and to keep the site secure and functioning. It
          is not sold or rented.
        </p>

        <h2>Third-party services</h2>
        <ul>
          <li>
            <strong>Vercel</strong> — hosting and content delivery.
          </li>
          <li>
            <strong>Calendly</strong> — meeting scheduling (only if you choose to
            book).
          </li>
          <li>
            <strong>LinkedIn</strong> — if you follow the external profile link.
          </li>
        </ul>
        <p>
          These providers process data under their own privacy policies. Please
          review them for details on their practices.
        </p>

        <h2>Data retention</h2>
        <p>
          Emails and booking details are kept only as long as needed to
          correspond with you or fulfill a meeting, and are deleted when no longer
          needed. Host server logs are retained per the provider’s standard
          schedule.
        </p>

        <h2>Your choices and rights</h2>
        <p>
          You can request access to, correction of, or deletion of any personal
          information you have shared with me directly by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. For information
          held by Calendly or LinkedIn, please use those services’ own controls.
        </p>

        <h2>Children’s privacy</h2>
        <p>
          This site is not directed to children and does not knowingly collect
          information from anyone under the age of 16.
        </p>

        <h2>International visitors</h2>
        <p>
          The site is hosted in the United States. If you access it from
          elsewhere, your information may be processed in the United States and
          other countries where the listed providers operate.
        </p>

        <h2>Changes</h2>
        <p>
          This policy may be updated from time to time. Material changes will be
          reflected by updating the “Last updated” date above.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <p className="legal__note">
          This statement is provided for transparency and is not legal advice. If
          your use of the site changes (for example, adding analytics, payments,
          or user accounts), this policy should be reviewed and updated
          accordingly.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
