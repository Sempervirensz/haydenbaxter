"use client";

import { Header } from './Header';
import { Hero } from './Hero';
import { Background } from './Background';
import { WorkOverview } from './WorkOverview';
import { Connector } from './Connector';
import { Operator } from './Operator';
import { Builder } from './Builder';
import { WorldPulse } from './WorldPulse';
import { Ideas } from './Ideas';
import { Connect } from './Connect';
import { Footer } from './Footer';

export default function V2Site() {
  return (
    <div className="v2-root min-h-screen bg-ink-50 text-ink-900">
      <Header />
      <main id="main">
        {/* 30-second experience */}
        <Hero />

        {/* 5-minute experience */}
        <Background />
        <WorkOverview />

        {/* 30-minute chapter journey */}
        <Connector />
        <Operator />
        <Builder />
        <WorldPulse />
        <Ideas />

        {/* Conversion */}
        <Connect />
      </main>
      <Footer />
    </div>
  );
}
