// Internal blog data. New posts are added by /admin/compose (dev-only) — the
// composer copies a snippet to the clipboard which is pasted directly below
// the COMPOSE_INSERT_BELOW marker.

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export interface JournalPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  thumbnail: string;
  hero: string;
  author: string;
  body: BlogBlock[];
}

export const JOURNAL_COPY = {
  heading: "Journal",
  subline:
    "Long-form thinking on AI, supply chain, and building products that matter.",
  ctaLabel: "Read the full journal",
  ctaHref: "/blog",
};

export const BLOG_POSTS: JournalPost[] = [
  // <COMPOSE_INSERT_BELOW> — do not remove; /admin/compose pastes new posts after this line.
  {
    slug: "3-takeaways-from-innovation-forum-s-sustainable-apparel-textiles-conference",
    title: "3 Takeaways from Innovation Forum’s Sustainable Apparel & Textiles Conference",
    date: "July 29, 2026",
    excerpt: "What Amsterdam revealed about shared responsibility, Digital Product Passports, and the future of sustainability in apparel.",
    tags: [
      "Sustainable Apparel",
      "Digital Product Passports",
      "Supply Chain",
    ],
    thumbnail: "/images/blog/3-takeaways-from-innovation-forum-s-sustainable-apparel-textiles-conference.png",
    hero: "/images/blog/3-takeaways-from-innovation-forum-s-sustainable-apparel-textiles-conference.png",
    author: "Hayden Baxter",
    body: [
      { type: "heading", text: `At a Glance` },
      { type: "paragraph", text: `Three takeaways stood out from Innovation Forum’s Sustainable Apparel & Textiles Conference:` },
      { type: "list", items: [
        `1. Sustainability cannot keep working like a game of hot potato. Cost, risk, and data demands are still too often pushed further down the supply chain.`,
        `2. Digital Product Passports are more than a compliance tool. They create a new layer of digital real estate attached to physical products, giving brands a chance to turn traceability into trust, storytelling, and customer connection.`,
        `3. Sustainability needs a stronger business case without losing its moral center. The work has to move beyond audits and reports into sourcing, pricing, supplier investment, product design, and factory conditions.`,
      ] },
      { type: "heading", text: `**Arriving in Amsterdam**` },
      { type: "paragraph", text: `“Amsterdam Amstel Station.”` },
      { type: "paragraph", text: `I heard the Dutch loudspeaker call out in a smooth voice as I stepped off the train. A few minutes later, after dodging bikes like a game of Frogger, I arrived at Hotel Casa, where apparel sustainability leaders from across the industry had gathered.` },
      { type: "paragraph", text: `Regulators. Brands. Service providers. Policymakers. The people who decide what accountability costs, and who pays for it.` },
      { type: "paragraph", text: `WorldPulse was there to listen firsthand.` },
      { type: "paragraph", text: `The conference was collaborative and honest. Progress was visible, but so were the gaps. The industry knows where it has been. It is still figuring out where it is going.` },
      { type: "heading", text: `1. The Apparel Industry Cannot Keep Playing Hot Potato with Responsibility` },
      { type: "paragraph", text: `For too long, sustainability has meant passing cost, risk, complexity, and data requirements further down the supply chain.` },
      { type: "paragraph", text: `Brands want speed, margin, quality, compliance, and transparency.` },
      { type: "paragraph", text: `Suppliers are expected to deliver all of it with limited room to invest.` },
      { type: "paragraph", text: `Workers absorb the pressure.` },
      { type: "paragraph", text: `Consumers want lower prices, faster delivery, and better information, even when those demands conflict.` },
      { type: "paragraph", text: `But when responsibility keeps moving downstream, everyone loses.` },
      { type: "list", items: [
        `**Workers lose** because the pressure of speed, heat, low margins, and unstable working conditions lands on them first.`,
        `**Suppliers lose trust** when they are expected to meet rising expectations without the investment to support them.`,
        `**Brands weaken their own supply chains** when they treat sustainability as a demand rather than a partnership.`,
        `**Consumers lose confidence** when claims are not backed by clear, credible information.`,
        `*The hot potato game has to end.*`,
      ] },
      { type: "paragraph", text: `True sustainability requires shared responsibility, better data systems, fairer investment, and earlier collaboration between brands, suppliers, factories, farmers, workers, regulators, recyclers, and technology partners.` },
      { type: "paragraph", text: `Everyone needs a seat at the table because everyone is affected by the product long before it reaches the consumer.` },
      { type: "paragraph", text: `A product is only as sustainable as the people, systems, and relationships behind it.` },
      { type: "heading", text: `2. Brands Are About to Have Digital Real Estate Attached to Every Product They Sell` },
      { type: "paragraph", text: `As technology progresses, buyers will not be satisfied with a bland laundry list of materials or a quick blurb on a label. They will want a story, a connection, and a reason to believe the product is worth choosing.` },
      { type: "paragraph", text: `That is where Digital Product Passports become powerful.` },
      { type: "paragraph", text: `A Digital Product Passport can show:` },
      { type: "list", items: [
        `Where a product came from`,
        `Who made it`,
        `What materials went into it`,
        `How it was produced`,
        `Why it matters`,
        `How it can be repaired, reused, recycled, or responsibly handled at end of life`,
      ] },
      { type: "paragraph", text: `DPPs can be both a requirement and a revolution.` },
      { type: "paragraph", text: `With one scan, a product can become more than an item on a rack. It can bring the customer into the world behind the product: the people, places, materials, and decisions that brought it to life.` },
      { type: "paragraph", text: `That is the difference between checking a box and creating value.` },
      { type: "paragraph", text: `For brands, this is not just a compliance question. It is a storytelling question. A trust question. A customer experience question.` },
      { type: "paragraph", text: `Every product is becoming a digital surface.` },
      { type: "paragraph", text: `The question is whether brands will use that surface to say something meaningful.` },
      { type: "heading", text: `3. Sustainability Needs a Business Case Without Losing Its Moral Center` },
      { type: "paragraph", text: `Sustainability cannot stay trapped as a reporting function.` },
      { type: "paragraph", text: `For too long, sustainability has been stuck in the back office, buried in audits, reporting, compliance, and cost conversations. If the work always looks like extra cost, extra reporting, and extra friction, it will stay underpowered inside companies.` },
      { type: "paragraph", text: `Amsterdam surfaced something honest: the people doing this work are tired.` },
      { type: "paragraph", text: `Not tired of the mission.` },
      { type: "paragraph", text: `Tired of the machinery around it.` },
      { type: "list", items: [
        `Shifting CSRD scope`,
        `Data systems built against uncertain criteria`,
        `Audit frameworks that multiply without aligning`,
        `Supplier expectations that keep rising without enough support`,
        `Public commitments that internal systems cannot always back up`,
      ] },
      { type: "paragraph", text: `The CSRD, the EU’s landmark directive requiring large companies to disclose how their operations affect people and the planet, keeps changing shape. Companies are building toward a finish line that keeps moving.` },
      { type: "paragraph", text: `And when companies go quiet on their commitments, the room read it clearly.` },
      { type: "paragraph", text: `Greenhushing is not caution. It is what happens when internal systems cannot back up what leadership once promised.` },
      { type: "paragraph", text: `Sustainability has to move into the decisions that shape products before they are made.` },
      { type: "paragraph", text: `That means:` },
      { type: "list", items: [
        `Sourcing`,
        `Pricing`,
        `Supplier investment`,
        `Product design`,
        `Factory conditions`,
        `Material choices`,
        `Long-term supplier relationships`,
      ] },
      { type: "paragraph", text: `That is where sustainability gains teeth.` },
      { type: "paragraph", text: `Reports can name the problem. They cannot fix the factory.` },
      { type: "paragraph", text: `The moral stakes have not changed: safer workers, cleaner production, and more honest supply chains. But those outcomes need budget, authority, and the kind of long-term supplier relationships where real change is actually possible.` },
      { type: "paragraph", text: `Sustainability cannot just prove that problems exist. It has to help companies make better choices before those problems become someone else’s burden.` },
    ],
  },
  {
    slug: "from-compliance-to-collaboration-3-takeaways-from-innovation-forum-s-sustainable",
    title: "From Compliance to Collaboration: 3 Takeaways from Innovation Forum’s Sustainable Apparel & Textiles Conference",
    date: "July 29, 2026",
    excerpt: "What Amsterdam revealed about shared responsibility, Digital Product Passports, and the future of sustainability in apparel.",
    tags: [
      "Sustainable Apparel",
      "Digital Product Passports",
      "Supply Chain",
    ],
    thumbnail: "/images/blog/from-compliance-to-collaboration-3-takeaways-from-innovation-forum-s-sustainable.png",
    hero: "/images/blog/from-compliance-to-collaboration-3-takeaways-from-innovation-forum-s-sustainable.png",
    author: "Hayden Baxter",
    body: [
      { type: "heading", text: `At a Glance` },
      { type: "paragraph", text: `The apparel industry is entering a new phase of accountability. Brands, suppliers, factories, farmers, workers, regulators, recyclers, and technology partners are all being pulled into the same conversation, but not always with the same power, resources, or ability to act.` },
      { type: "paragraph", text: `Three takeaways stood out from Innovation Forum’s Sustainable Apparel & Textiles Conference:` },
      { type: "list", items: [
        `Sustainability cannot keep working like a game of hot potato. Cost, risk, and data demands are still too often pushed further down the supply chain.`,
        `Digital Product Passports are more than a compliance tool. They create a new layer of digital real estate attached to physical products, giving brands a chance to turn traceability into trust, storytelling, and customer connection.`,
        `Sustainability needs a stronger business case without losing its moral center. The work has to move beyond audits and reports into sourcing, pricing, supplier investment, product design, and factory conditions.`,
      ] },
      { type: "paragraph", text: `Progress is visible. So are the gaps. The industry knows where it has been. It is still deciding what kind of future it is willing to build.` },
      { type: "heading", text: `Arriving in Amsterdam` },
      { type: "paragraph", text: `“Amsterdam Amstel Station.”` },
      { type: "paragraph", text: `I heard the Dutch loudspeaker call out in a smooth voice as I stepped off the train. A few minutes later, after dodging bikes like a game of Frogger, I arrived at Hotel Casa, where apparel sustainability leaders from across the industry had gathered.` },
      { type: "paragraph", text: `Regulators. Brands. Service providers. Policymakers. The people who decide what accountability costs, and who pays for it.` },
      { type: "paragraph", text: `WorldPulse was there to listen firsthand.` },
      { type: "paragraph", text: `The conference was collaborative and honest. Progress was visible, but so were the gaps. The industry knows where it has been. It is still figuring out where it is going.` },
      { type: "heading", text: `1. The Apparel Industry Cannot Keep Playing Hot Potato with Responsibility` },
      { type: "paragraph", text: `For too long, sustainability has meant passing cost, risk, complexity, and data requirements further down the supply chain.` },
      { type: "paragraph", text: `Brands want speed, margin, quality, compliance, and transparency.` },
      { type: "paragraph", text: `Suppliers are expected to deliver all of it with limited room to invest.` },
      { type: "paragraph", text: `Workers absorb the pressure.` },
      { type: "paragraph", text: `Consumers want lower prices, faster delivery, and better information, even when those demands conflict.` },
      { type: "paragraph", text: `But when responsibility keeps moving downstream, everyone loses.` },
      { type: "list", items: [
        `**Workers lose** because the pressure of speed, heat, low margins, and unstable working conditions lands on them first.`,
        `**Suppliers lose trust** when they are expected to meet rising expectations without the investment to support them.`,
        `**Brands weaken their own supply chains** when they treat sustainability as a demand rather than a partnership.`,
        `**Consumers lose confidence** when claims are not backed by clear, credible information.`,
      ] },
      { type: "paragraph", text: `The hot potato game has to end.` },
      { type: "paragraph", text: `True sustainability requires shared responsibility, better data systems, fairer investment, and earlier collaboration between brands, suppliers, factories, farmers, workers, regulators, recyclers, and technology partners.` },
      { type: "paragraph", text: `Everyone needs a seat at the table because everyone is affected by the product long before it reaches the consumer.` },
      { type: "paragraph", text: `A product is only as sustainable as the people, systems, and relationships behind it.` },
      { type: "heading", text: `2. Brands Are About to Have Digital Real Estate Attached to Every Product They Sell` },
      { type: "paragraph", text: `As technology progresses, buyers will not be satisfied with a bland laundry list of materials or a quick blurb on a label. They will want a story, a connection, and a reason to believe the product is worth choosing.` },
      { type: "paragraph", text: `That is where Digital Product Passports become powerful.` },
      { type: "paragraph", text: `A Digital Product Passport can show:` },
      { type: "list", items: [
        `Where a product came from`,
        `Who made it`,
        `What materials went into it`,
        `How it was produced`,
        `Why it matters`,
        `How it can be repaired, reused, recycled, or responsibly handled at end of life`,
      ] },
      { type: "paragraph", text: `DPPs can be both a requirement and a revolution.` },
      { type: "paragraph", text: `With one scan, a product can become more than an item on a rack. It can bring the customer into the world behind the product: the people, places, materials, and decisions that brought it to life.` },
      { type: "paragraph", text: `That is the difference between checking a box and creating value.` },
      { type: "paragraph", text: `For brands, this is not just a compliance question. It is a storytelling question. A trust question. A customer experience question.` },
      { type: "paragraph", text: `Every product is becoming a digital surface.` },
      { type: "paragraph", text: `The question is whether brands will use that surface to say something meaningful.` },
      { type: "heading", text: `3. Sustainability Needs a Business Case Without Losing Its Moral Center` },
      { type: "paragraph", text: `Sustainability cannot stay trapped as a reporting function.` },
      { type: "paragraph", text: `For too long, sustainability has been stuck in the back office, buried in audits, reporting, compliance, and cost conversations. If the work always looks like extra cost, extra reporting, and extra friction, it will stay underpowered inside companies.` },
      { type: "paragraph", text: `Amsterdam surfaced something honest: the people doing this work are tired.` },
      { type: "paragraph", text: `Not tired of the mission.` },
      { type: "paragraph", text: `Tired of the machinery around it.` },
      { type: "list", items: [
        `Shifting CSRD scope`,
        `Data systems built against uncertain criteria`,
        `Audit frameworks that multiply without aligning`,
        `Supplier expectations that keep rising without enough support`,
        `Public commitments that internal systems cannot always back up`,
      ] },
      { type: "paragraph", text: `The CSRD, the EU’s landmark directive requiring large companies to disclose how their operations affect people and the planet, keeps changing shape. Companies are building toward a finish line that keeps moving.` },
      { type: "paragraph", text: `And when companies go quiet on their commitments, the room read it clearly.` },
      { type: "paragraph", text: `Greenhushing is not caution. It is what happens when internal systems cannot back up what leadership once promised.` },
      { type: "paragraph", text: `Sustainability has to move into the decisions that shape products before they are made.` },
      { type: "paragraph", text: `That means:` },
      { type: "list", items: [
        `Sourcing`,
        `Pricing`,
        `Supplier investment`,
        `Product design`,
        `Factory conditions`,
        `Material choices`,
        `Long-term supplier relationships`,
      ] },
      { type: "paragraph", text: `That is where sustainability gains teeth.` },
      { type: "paragraph", text: `Reports can name the problem. They cannot fix the factory.` },
      { type: "paragraph", text: `The moral stakes have not changed: safer workers, cleaner production, and more honest supply chains. But those outcomes need budget, authority, and the kind of long-term supplier relationships where real change is actually possible.` },
      { type: "paragraph", text: `Sustainability cannot just prove that problems exist. It has to help companies make better choices before those problems become someone else’s burden.` },
      { type: "heading", text: `Final Thought` },
      { type: "paragraph", text: `The apparel industry is not short on frameworks, acronyms, or ambition.` },
      { type: "paragraph", text: `What it needs now is alignment.` },
      { type: "paragraph", text: `Alignment between brands and suppliers. Between regulation and implementation. Between product data and product storytelling. Between sustainability teams and commercial teams. Between moral responsibility and business reality.` },
      { type: "paragraph", text: `That is the next phase.` },
      { type: "paragraph", text: `Not sustainability as a side function.` },
      { type: "paragraph", text: `Not transparency as a marketing claim.` },
      { type: "paragraph", text: `Not compliance as a last-minute scramble.` },
      { type: "paragraph", text: `But collaboration built into the way products are designed, sourced, made, sold, and understood.` },
      { type: "paragraph", text: `That is the future WorldPulse is building toward.` },
    ],
  },
  {
    slug: "test",
    title: "test",
    date: "May 9, 2026",
    excerpt: "test",
    tags: [
      "test",
    ],
    thumbnail: "/images/blog/test.png",
    hero: "/images/blog/test.png",
    author: "Hayden Baxter",
    body: [
      { type: "paragraph", text: `test` },
    ],
  },
];

export function getBlogPostBySlug(slug: string): JournalPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

// Legacy compatibility for the home-page <JournalSection />.
// Maps the new shape onto the older surface the section was built for.
export const JOURNAL_DATA = {
  heading: JOURNAL_COPY.heading,
  subline: JOURNAL_COPY.subline,
  blogUrl: JOURNAL_COPY.ctaHref,
  blogLabel: JOURNAL_COPY.ctaLabel,
  posts: BLOG_POSTS,
};
