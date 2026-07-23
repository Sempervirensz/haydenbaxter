"use client";

import { useState } from "react";
import type {
  LabProject,
  SectionState,
  ShotMode,
  VariantId,
} from "@/data/detailLab";
import {
  CTA,
  ContentBoxes,
  DetailList,
  Kicker,
  Lede,
  MetaRail,
  ProblemBox,
  PullQuote,
  Screens,
  SectionTitle,
  StackChips,
  StatTiles,
} from "./primitives";

export interface VariantProps {
  project: LabProject;
  show: SectionState;
  shotMode: ShotMode;
}

/* Each variant composes the same primitives in a different arrangement.
   Layout lives in the wrapper className; the blocks themselves are shared. */

function ScreensSection({ project, show, shotMode }: VariantProps) {
  if (!show.screenshots) return null;
  return (
    <section className="dl-section" aria-label="Screenshots">
      <SectionTitle>Screenshots</SectionTitle>
      <Screens screenshots={project.screenshots} mode={shotMode} />
    </section>
  );
}

// ---- V01 Classic Stack ----
function Classic(p: VariantProps) {
  const { project, show, shotMode } = p;
  return (
    <article className="dl-layout dl-layout--classic">
      <Kicker project={project} showBadge={show.badge} />
      {show.summary && <Lede text={project.summary} />}
      {show.problem && <ProblemBox text={project.problem} />}
      {show.meta && <MetaRail project={project} />}
      {show.stack && <StackChips items={project.stack} />}
      {show.stats && <StatTiles stats={project.stats} />}
      <ScreensSection {...p} />
      {show.pullQuote && <PullQuote {...project.pullQuote} />}
      {show.techBreakdown && <DetailList title="Technical breakdown" items={project.techBreakdown} />}
      {show.contentBoxes && <ContentBoxes boxes={project.contentBoxes} />}
      {show.outcomes && <DetailList title="Outcomes" items={project.outcomes} />}
      {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
      {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
    </article>
  );
}

// ---- V02 Screens First ----
function ScreensFirst(p: VariantProps) {
  const { project, show } = p;
  return (
    <article className="dl-layout dl-layout--screensFirst">
      <Kicker project={project} showBadge={show.badge} />
      <ScreensSection {...p} />
      {show.summary && <Lede text={project.summary} />}
      {show.stats && <StatTiles stats={project.stats} />}
      {show.problem && <ProblemBox text={project.problem} />}
      {show.pullQuote && <PullQuote {...project.pullQuote} />}
      {show.techBreakdown && <DetailList title="Technical breakdown" items={project.techBreakdown} />}
      {show.outcomes && <DetailList title="Outcomes" items={project.outcomes} />}
      {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
      {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
    </article>
  );
}

// ---- V03 Split Rail ----
function SplitRail(p: VariantProps) {
  const { project, show, shotMode } = p;
  return (
    <article className="dl-layout dl-layout--splitRail">
      <Kicker project={project} showBadge={show.badge} />
      <div className="dl-split">
        <div className="dl-split__main">
          {show.summary && <Lede text={project.summary} />}
          {show.problem && <ProblemBox text={project.problem} />}
          {show.stats && <StatTiles stats={project.stats} />}
          {show.techBreakdown && <DetailList title="Technical breakdown" items={project.techBreakdown} />}
          {show.outcomes && <DetailList title="Outcomes" items={project.outcomes} />}
          {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
          {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
        </div>
        <aside className="dl-split__rail">
          {show.screenshots && <Screens screenshots={project.screenshots} mode={shotMode} />}
          {show.meta && <MetaRail project={project} />}
          {show.stack && <StackChips items={project.stack} />}
        </aside>
      </div>
    </article>
  );
}

// ---- V04 Meta Sidebar ----
function MetaSidebar(p: VariantProps) {
  const { project, show } = p;
  return (
    <article className="dl-layout dl-layout--metaSidebar">
      <Kicker project={project} showBadge={show.badge} />
      <div className="dl-split dl-split--narrowLeft">
        <aside className="dl-split__rail">
          {show.meta && <MetaRail project={project} />}
          {show.stack && <StackChips items={project.stack} />}
          {show.stats && <StatTiles stats={project.stats} />}
        </aside>
        <div className="dl-split__main">
          {show.summary && <Lede text={project.summary} />}
          {show.problem && <ProblemBox text={project.problem} />}
          <ScreensSection {...p} />
          {show.pullQuote && <PullQuote {...project.pullQuote} />}
          {show.techBreakdown && <DetailList title="Technical breakdown" items={project.techBreakdown} />}
          {show.contentBoxes && <ContentBoxes boxes={project.contentBoxes} />}
          {show.outcomes && <DetailList title="Outcomes" items={project.outcomes} />}
          {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
          {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
        </div>
      </div>
    </article>
  );
}

// ---- V05 Editorial ----
function Editorial(p: VariantProps) {
  const { project, show, shotMode } = p;
  const [a, b, ...rest] = project.screenshots;
  return (
    <article className="dl-layout dl-layout--editorial">
      <Kicker project={project} showBadge={show.badge} />
      {show.summary && <Lede text={project.summary} />}
      {show.screenshots && a && (
        <div className="dl-editRow">
          <div className="dl-editRow__media"><Screens screenshots={[a]} mode="stacked" /></div>
          <div className="dl-editRow__text">
            {show.problem && <ProblemBox text={project.problem} />}
          </div>
        </div>
      )}
      {show.pullQuote && <PullQuote {...project.pullQuote} />}
      {show.screenshots && b && (
        <div className="dl-editRow dl-editRow--reverse">
          <div className="dl-editRow__media"><Screens screenshots={[b]} mode="stacked" /></div>
          <div className="dl-editRow__text">
            {show.techBreakdown && <DetailList title="Technical breakdown" items={project.techBreakdown} />}
          </div>
        </div>
      )}
      {show.stats && <StatTiles stats={project.stats} />}
      {show.screenshots && rest.length > 0 && (
        <section className="dl-section" aria-label="More screens">
          <Screens screenshots={rest} mode={shotMode === "carousel" ? "carousel" : "grid"} />
        </section>
      )}
      {show.outcomes && <DetailList title="Outcomes" items={project.outcomes} />}
      {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
      {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
    </article>
  );
}

// ---- V06 Dossier ----
function Dossier(p: VariantProps) {
  const { project, show, shotMode } = p;
  return (
    <article className="dl-layout dl-layout--dossier">
      <Kicker project={project} showBadge={show.badge} />
      <div className="dl-dossierGrid">
        {show.meta && (
          <div className="dl-dossierCell">
            <span className="dl-sectionTitle">Meta</span>
            <MetaRail project={project} />
          </div>
        )}
        {show.stack && (
          <div className="dl-dossierCell">
            <span className="dl-sectionTitle">Stack</span>
            <StackChips items={project.stack} />
          </div>
        )}
        {show.stats && (
          <div className="dl-dossierCell dl-dossierCell--wide">
            <span className="dl-sectionTitle">By the numbers</span>
            <StatTiles stats={project.stats} />
          </div>
        )}
      </div>
      {show.summary && <Lede text={project.summary} />}
      {show.problem && <ProblemBox text={project.problem} />}
      <ScreensSection {...p} />
      <div className="dl-dossierLists">
        {show.techBreakdown && <DetailList title="Technical breakdown" items={project.techBreakdown} />}
        {show.outcomes && <DetailList title="Outcomes" items={project.outcomes} />}
        {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
      </div>
      {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
    </article>
  );
}

// ---- V07 Tabbed ----
function Tabbed(p: VariantProps) {
  const { project, show, shotMode } = p;
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "screens", label: "Screens" },
    { id: "tech", label: "Tech" },
    { id: "outcomes", label: "Outcomes" },
  ];
  const [active, setActive] = useState("overview");
  return (
    <article className="dl-layout dl-layout--tabbed">
      <Kicker project={project} showBadge={show.badge} />
      <div className="dl-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            className={active === t.id ? "dl-tab is-active" : "dl-tab"}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="dl-tabPanel">
        {active === "overview" && (
          <>
            {show.summary && <Lede text={project.summary} />}
            {show.problem && <ProblemBox text={project.problem} />}
            {show.meta && <MetaRail project={project} />}
            {show.stack && <StackChips items={project.stack} />}
            {show.stats && <StatTiles stats={project.stats} />}
          </>
        )}
        {active === "screens" && <ScreensSection {...p} />}
        {active === "tech" && (
          <>
            {show.techBreakdown && <DetailList title="Technical breakdown" items={project.techBreakdown} />}
            {show.contentBoxes && <ContentBoxes boxes={project.contentBoxes} />}
          </>
        )}
        {active === "outcomes" && (
          <>
            {show.pullQuote && <PullQuote {...project.pullQuote} />}
            {show.outcomes && <DetailList title="Outcomes" items={project.outcomes} />}
            {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
          </>
        )}
      </div>
      {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
    </article>
  );
}

// ---- V08 Accordion (native expand/contract) ----
function Accordion(p: VariantProps) {
  const { project, show, shotMode } = p;
  return (
    <article className="dl-layout dl-layout--accordion">
      <Kicker project={project} showBadge={show.badge} />
      {show.summary && <Lede text={project.summary} />}
      {show.problem && (
        <details className="dl-acc" open>
          <summary className="dl-acc__head">The problem</summary>
          <div className="dl-acc__body"><ProblemBox text={project.problem} /></div>
        </details>
      )}
      {show.screenshots && (
        <details className="dl-acc" open>
          <summary className="dl-acc__head">Screenshots</summary>
          <div className="dl-acc__body"><Screens screenshots={project.screenshots} mode={shotMode} /></div>
        </details>
      )}
      {show.stats && (
        <details className="dl-acc">
          <summary className="dl-acc__head">By the numbers</summary>
          <div className="dl-acc__body"><StatTiles stats={project.stats} /></div>
        </details>
      )}
      {show.techBreakdown && (
        <details className="dl-acc">
          <summary className="dl-acc__head">Technical breakdown</summary>
          <div className="dl-acc__body"><DetailList title="" items={project.techBreakdown} /></div>
        </details>
      )}
      {show.outcomes && (
        <details className="dl-acc">
          <summary className="dl-acc__head">Outcomes &amp; lessons</summary>
          <div className="dl-acc__body">
            <DetailList title="Outcomes" items={project.outcomes} />
            {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
          </div>
        </details>
      )}
      {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
    </article>
  );
}

// ---- V09 Mosaic ----
function Mosaic(p: VariantProps) {
  const { project, show, shotMode } = p;
  return (
    <article className="dl-layout dl-layout--mosaic">
      <Kicker project={project} showBadge={show.badge} />
      <div className="dl-mosaic">
        {show.summary && <div className="dl-mosaic__cell dl-mosaic__cell--wide dl-card"><Lede text={project.summary} /></div>}
        {show.stats && <div className="dl-mosaic__cell dl-card"><StatTiles stats={project.stats} /></div>}
        {show.problem && <div className="dl-mosaic__cell dl-card"><ProblemBox text={project.problem} /></div>}
        {show.screenshots && (
          <div className="dl-mosaic__cell dl-mosaic__cell--wide dl-card">
            <Screens screenshots={project.screenshots} mode={shotMode === "stacked" ? "grid" : shotMode} />
          </div>
        )}
        {show.meta && <div className="dl-mosaic__cell dl-card"><MetaRail project={project} /></div>}
        {show.stack && <div className="dl-mosaic__cell dl-card"><StackChips items={project.stack} /></div>}
        {show.pullQuote && <div className="dl-mosaic__cell dl-mosaic__cell--wide dl-card"><PullQuote {...project.pullQuote} /></div>}
        {show.techBreakdown && <div className="dl-mosaic__cell dl-card"><DetailList title="Technical breakdown" items={project.techBreakdown} /></div>}
        {show.outcomes && <div className="dl-mosaic__cell dl-card"><DetailList title="Outcomes" items={project.outcomes} /></div>}
        {show.lessonsLearned && <div className="dl-mosaic__cell dl-card"><DetailList title="Lessons learned" items={project.lessonsLearned} /></div>}
      </div>
      {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
    </article>
  );
}

// ---- V10 Story Scroll (sticky nav, anchor links) ----
function StoryScroll(p: VariantProps) {
  const { project, show, shotMode } = p;
  const nav = [
    show.summary && { id: "overview", label: "Overview" },
    show.screenshots && { id: "screens", label: "Screens" },
    show.techBreakdown && { id: "tech", label: "Tech" },
    show.outcomes && { id: "outcomes", label: "Outcomes" },
  ].filter(Boolean) as { id: string; label: string }[];
  return (
    <article className="dl-layout dl-layout--story">
      <Kicker project={project} showBadge={show.badge} />
      <div className="dl-story">
        <nav className="dl-story__nav" aria-label="Sections">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="dl-story__navLink">{n.label}</a>
          ))}
        </nav>
        <div className="dl-story__body">
          {show.summary && (
            <section id="overview" className="dl-section">
              <Lede text={project.summary} />
              {show.problem && <ProblemBox text={project.problem} />}
              {show.stats && <StatTiles stats={project.stats} />}
            </section>
          )}
          {show.screenshots && (
            <section id="screens" className="dl-section">
              <SectionTitle>Screenshots</SectionTitle>
              <Screens screenshots={project.screenshots} mode={shotMode} />
            </section>
          )}
          {show.techBreakdown && (
            <section id="tech" className="dl-section">
              <DetailList title="Technical breakdown" items={project.techBreakdown} />
              {show.contentBoxes && <ContentBoxes boxes={project.contentBoxes} />}
            </section>
          )}
          {show.outcomes && (
            <section id="outcomes" className="dl-section">
              <DetailList title="Outcomes" items={project.outcomes} />
              {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
              {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

// ---- V11 Centered Column ----
function Centered(p: VariantProps) {
  const { project, show } = p;
  return (
    <article className="dl-layout dl-layout--centered">
      <Kicker project={project} showBadge={show.badge} />
      {show.summary && <Lede text={project.summary} />}
      {show.problem && <ProblemBox text={project.problem} />}
      {show.pullQuote && <PullQuote {...project.pullQuote} />}
      <ScreensSection {...p} />
      {show.stats && <StatTiles stats={project.stats} />}
      {show.techBreakdown && <DetailList title="Technical breakdown" items={project.techBreakdown} />}
      {show.contentBoxes && <ContentBoxes boxes={project.contentBoxes} />}
      {show.outcomes && <DetailList title="Outcomes" items={project.outcomes} />}
      {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
      {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
    </article>
  );
}

// ---- V12 Hero Banner ----
function HeroBanner(p: VariantProps) {
  const { project, show, shotMode } = p;
  const hero = project.screenshots[0];
  const rest = project.screenshots.slice(1);
  return (
    <article className="dl-layout dl-layout--heroBanner">
      <div className={`dl-banner dl-shot__frame--${hero?.tint ?? "cobalt"}`}>
        <Kicker project={project} showBadge={show.badge} overlay />
      </div>
      <div className="dl-banner__below">
        {show.summary && <Lede text={project.summary} />}
        {show.stats && <StatTiles stats={project.stats} />}
        {show.problem && <ProblemBox text={project.problem} />}
        {show.meta && <MetaRail project={project} />}
        {show.stack && <StackChips items={project.stack} />}
        {show.screenshots && rest.length > 0 && (
          <section className="dl-section" aria-label="Screenshots">
            <SectionTitle>Screenshots</SectionTitle>
            <Screens screenshots={rest} mode={shotMode} />
          </section>
        )}
        {show.pullQuote && <PullQuote {...project.pullQuote} />}
        {show.techBreakdown && <DetailList title="Technical breakdown" items={project.techBreakdown} />}
        {show.outcomes && <DetailList title="Outcomes" items={project.outcomes} />}
        {show.lessonsLearned && <DetailList title="Lessons learned" items={project.lessonsLearned} />}
        {show.cta && <CTA href={project.liveUrl} label={project.liveLabel} />}
      </div>
    </article>
  );
}

export const VARIANT_COMPONENTS: Record<VariantId, React.FC<VariantProps>> = {
  classic: Classic,
  "screens-first": ScreensFirst,
  "split-rail": SplitRail,
  "meta-sidebar": MetaSidebar,
  editorial: Editorial,
  dossier: Dossier,
  tabbed: Tabbed,
  accordion: Accordion,
  mosaic: Mosaic,
  "story-scroll": StoryScroll,
  centered: Centered,
  "hero-banner": HeroBanner,
};
