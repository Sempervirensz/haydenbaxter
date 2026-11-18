/* ============================================================
   Centralized content for Hayden Baxter's website.
   All facts derived from the creative brief. Nothing invented.
   ============================================================ */

export const PROFILE = {
  name: 'Hayden Baxter',
  roles: ['Global Business Strategist', 'AI Product Builder', 'Supply Chain & Sourcing', 'International Business'],
  centralMessage:
    'I help organizations put AI to work, strengthen global supply chains, and innovate where sustainability meets next-generation technology.',
  philosophy: [
    'Curiosity drives understanding.',
    'Understanding enables better decisions.',
    'Technology becomes valuable when it solves real human problems.',
  ],
  languages: 'Fluent in Mandarin Chinese',
  education: [
    {
      degree: 'B.S. Global Business',
      school: 'Utah State University',
      detail: 'Dual bachelor\u2019s degrees in Global Business and Mandarin Chinese',
    },
    {
      degree: 'M.S. Artificial Intelligence in Business',
      school: 'Arizona State University',
      detail: 'Master of Science, AI in Business',
    },
  ],
} as const;

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/haydenjbaxter/',
  worldpulse: 'https://worldxpulse.com',
  email: 'mailto:haydenjbaxter@gmail.com',
  calendly: 'https://calendly.com/haydenjbaxter/30min',
} as const;

export type Experience = {
  id: string;
  company: string;
  role: string;
  region: string;
  focus: string;
  summary: string;
  details: { heading: string; body: string }[];
  tools: string[];
  outcome: string;
};

export const EXPERIENCES: Experience[] = [
  {
    id: 'nike-converse',
    company: 'Nike & Converse',
    role: 'Global Sourcing Operations',
    region: 'USA \u00b7 Vietnam \u00b7 Indonesia',
    focus: 'Supplier data governance & manufacturing expansion',
    summary:
      'Managed global sourcing operations spanning new factory onboarding, supplier traceability, and manufacturing expansion into Vietnam and Indonesia.',
    details: [
      {
        heading: 'Supplier data consolidation',
        body: 'Consolidated more than 1,000 supplier records across systems, improving data accuracy by 95% and creating a single, reliable source of supplier truth.',
      },
      {
        heading: 'New factory onboarding',
        body: 'Led onboarding of new factories into the manufacturing footprint, coordinating cross-functional requirements from quality, compliance, and operations.',
      },
      {
        heading: 'System integration',
        body: 'Integrated supplier information across SAP and Aravo, bridging operational systems of record with compliance and traceability platforms.',
      },
    ],
    tools: ['SAP', 'Aravo', 'Supplier Traceability', 'Factory Onboarding'],
    outcome: '1,000+ supplier records consolidated \u00b7 95% data accuracy improvement',
  },
  {
    id: 'disney',
    company: 'Disney',
    role: 'Strategic Technology & Media Procurement',
    region: 'USA',
    focus: 'Vendor onboarding & cross-functional coordination',
    summary:
      'Handled strategic technology and media procurement, vendor onboarding, and collaboration with Finance, Legal, and IT in support of international streaming operations.',
    details: [
      {
        heading: 'Cross-functional vendor onboarding',
        body: 'Coordinated vendor onboarding across Finance, Legal, and IT, balancing commercial terms, compliance requirements, and technical integration.',
      },
      {
        heading: 'International streaming support',
        body: 'Supported procurement needs behind international streaming operations, where scale and reliability requirements shaped every sourcing decision.',
      },
    ],
    tools: ['Strategic Procurement', 'Vendor Onboarding', 'Cross-functional'],
    outcome: 'Technology procurement for international media operations',
  },
  {
    id: 'aosom',
    company: 'Aosom',
    role: 'Logistics & Warehouse Operations',
    region: 'USA \u00b7 China',
    focus: 'Warehouse expansion & cross-border coordination',
    summary:
      'Managed logistics, warehouse expansion, and inventory systems alongside Wayfair operations, coordinating with the China-based parent organization.',
    details: [
      {
        heading: 'Warehouse expansion',
        body: 'Drove warehouse expansion and inventory system improvements to support growing cross-border e-commerce volume.',
      },
      {
        heading: 'Wayfair operations',
        body: 'Ran Wayfair channel operations, coordinating listings, fulfillment, and inventory accuracy with the China-based organization.',
      },
    ],
    tools: ['Inventory Systems', 'Warehouse Operations', 'Wayfair', 'Cross-border'],
    outcome: 'Scaled fulfillment capacity across cross-border operations',
  },
  {
    id: 'three-tree',
    company: 'Three Tree',
    role: 'Manufacturer Sourcing in China',
    region: 'China \u00b7 USA',
    focus: 'Supplier discovery & factory-to-buyer coordination',
    summary:
      'Connected American buyers with Chinese manufacturers through Canton Fair supplier discovery, negotiation, factory visits, and ongoing production coordination.',
    details: [
      {
        heading: 'Canton Fair & supplier discovery',
        body: 'Identified and evaluated manufacturers at the Canton Fair and through direct factory visits, building relationships that translated into production partnerships.',
      },
      {
        heading: 'Buyer\u2013supplier coordination',
        body: 'Acted as the bridge between American customers and Chinese suppliers, negotiating terms, translating requirements, and coordinating production across cultures and time zones.',
      },
    ],
    tools: ['Canton Fair', 'Factory Visits', 'Negotiation', 'Mandarin'],
    outcome: 'Bridged American buyers and Chinese manufacturers',
  },
];

export type AIProject = {
  id: string;
  name: string;
  tagline: string;
  status: 'Working product' | 'Prototype' | 'In development';
  problem: string;
  approach: string;
  value: string;
  lessons: string;
  pillars: { label: string; detail: string }[];
};

export const AI_PROJECTS: AIProject[] = [
  {
    id: 'cortex',
    name: 'Cortex',
    tagline: 'A connected knowledge and research system',
    status: 'Working product',
    problem:
      'Research fragments across notes, sources, and claims. Without structure, knowledge decays and provenance disappears.',
    approach:
      'Built around Obsidian, Cortex structures notes into evidence-backed claims with source provenance, retrieval, and knowledge graphs, supported by editorial workflows.',
    value: 'Turns scattered research into a durable, navigable knowledge base where every claim traces back to its source.',
    lessons: 'Provenance is the foundation of trust. A knowledge system is only as valuable as the links between its ideas.',
    pillars: [
      { label: 'Structured notes', detail: 'Notes carry metadata, claims, and evidence rather than free text alone.' },
      { label: 'Source provenance', detail: 'Every claim links to the source it came from.' },
      { label: 'Knowledge graph', detail: 'Relationships between ideas become explorable, not just searchable.' },
      { label: 'Editorial workflow', detail: 'Review and refine notes through a defined editorial process.' },
    ],
  },
  {
    id: 'atomicos',
    name: 'AtomicOS',
    tagline: 'A behavioral intelligence system',
    status: 'Working product',
    problem:
      'Habits and routines are hard to see. Without patterns, behavior change relies on guesswork.',
    approach:
      'Uses conversational check-ins, structured tracking, and analytics to reveal patterns across habits and routines over time.',
    value: 'Surfaces the behavioral patterns that shape daily life, making the invisible visible and actionable.',
    lessons: 'Conversation is a powerful data input. People reveal more when the interface feels human.',
    pillars: [
      { label: 'Conversational check-ins', detail: 'Lightweight prompts capture state without heavy forms.' },
      { label: 'Structured tracking', detail: 'Qualitative input becomes structured, queryable data.' },
      { label: 'Pattern analytics', detail: 'Aggregates reveal trends across weeks and months.' },
    ],
  },
  {
    id: 'casebrief',
    name: 'CaseBrief',
    tagline: 'Legal case intelligence from medical records',
    status: 'Working product',
    problem:
      'Medical records arrive as disorganized documents. Building a coherent case narrative means hours of manual extraction with citations lost along the way.',
    approach:
      'Organizes medical records into structured, source-backed case narratives that preserve citations and identify missing information.',
    value: 'Reduces manual review time and surfaces gaps in the record before they become problems.',
    lessons: 'In legal work, every assertion needs a source. Structure is not a luxury; it is a requirement.',
    pillars: [
      { label: 'Structured narratives', detail: 'Records become coherent case stories, not loose documents.' },
      { label: 'Preserved citations', detail: 'Every extracted fact retains a link to its source.' },
      { label: 'Gap detection', detail: 'Identifies missing information that could weaken a case.' },
    ],
  },
  {
    id: 'procurebridge',
    name: 'ProcureBridge',
    tagline: 'Procurement intelligence & supplier evaluation',
    status: 'In development',
    problem:
      'Supplier information lives in fragmented systems, spreadsheets, and emails, making consistent evaluation nearly impossible.',
    approach:
      'Consolidates fragmented supplier information into evaluation workflows that produce more consistent sourcing decisions.',
    value: 'Brings scattered supplier data into one evaluation framework so decisions are comparable and defensible.',
    lessons: 'Consistency beats completeness. A smaller, well-structured dataset outperforms a large, chaotic one.',
    pillars: [
      { label: 'Consolidation', detail: 'Unifies supplier data from multiple fragmented sources.' },
      { label: 'Evaluation workflows', detail: 'Structured scoring replaces ad-hoc judgment.' },
      { label: 'Consistent decisions', detail: 'Comparable evaluations lead to defensible sourcing choices.' },
    ],
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    tagline: 'Agentic workflows from idea to tool',
    status: 'In development',
    problem:
      'The gap between an idea and a functional tool is wide. Most people stop before the prototype.',
    approach:
      'Experimental agentic workflows that turn ideas into functional tools, exploring how AI agents can carry a concept from prompt to working output.',
    value: 'Explores whether AI agents can compress the distance between intention and implementation.',
    lessons: 'Agents are most useful when they augment judgment, not when they replace it.',
    pillars: [
      { label: 'Idea-to-tool', detail: 'Explores the path from concept to functional output.' },
      { label: 'Agentic workflows', detail: 'Chains of AI actions that build toward a result.' },
      { label: 'Experimental', detail: 'A lab for testing what agents can realistically do.' },
    ],
  },
];

/* ---- Interactive supply chain journey (illustrative / fictional) ---- */

export type SupplyStage = {
  id: string;
  label: string;
  location: string;
  description: string;
  data: { label: string; value: string }[];
};

export const SUPPLY_STAGES: SupplyStage[] = [
  {
    id: 'raw',
    label: 'Raw Materials',
    location: 'Origin region',
    description:
      'Fibers, metals, or components are sourced. At this stage, origin data is often thin and trust depends on relationships and audits.',
    data: [
      { label: 'Material', value: 'Organic cotton blend' },
      { label: 'Certification', value: 'Pending' },
      { label: 'Origin verified', value: 'No' },
    ],
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    location: 'Factory floor',
    description:
      'Materials become products. Factory records capture compliance, labor conditions, and production specifications.',
    data: [
      { label: 'Factory', value: 'Tier 1 supplier' },
      { label: 'Audit status', value: 'Current' },
      { label: 'Energy source', value: 'Grid mix' },
    ],
  },
  {
    id: 'logistics',
    label: 'Logistics',
    location: 'In transit',
    description:
      'Products move across borders. Shipping routes, emissions, and handoffs accumulate here, often invisibly.',
    data: [
      { label: 'Mode', value: 'Ocean freight' },
      { label: 'Distance', value: '~8,400 km' },
      { label: 'Carbon estimate', value: 'Recorded' },
    ],
  },
  {
    id: 'retail',
    label: 'Retail',
    location: 'Consumer-facing',
    description:
      'The product reaches a customer. This is where most transparency efforts stop, and where the product\u2019s story is usually lost.',
    data: [
      { label: 'Channel', value: 'Direct + retail' },
      { label: 'Product story', value: 'Unavailable' },
      { label: 'Customer access', value: 'None' },
    ],
  },
  {
    id: 'reuse',
    label: 'Reuse & Recycling',
    location: 'End of first life',
    description:
      'A Digital Product Passport can follow the product here, preserving its material story and enabling circular recovery.',
    data: [
      { label: 'Recovery path', value: 'Identified' },
      { label: 'Material value', value: 'Preserved' },
      { label: 'Circular potential', value: 'High' },
    ],
  },
];

/* ---- Supplier decision demo (illustrative / fictional) ---- */

export type Supplier = {
  id: string;
  name: string;
  country: string;
  cost: number; // 1-10, lower is cheaper
  reliability: number; // 1-10, higher is better
  transparency: number; // 1-10, higher is better
  speed: number; // 1-10, higher is faster
};

export const SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Supplier-001', country: 'Fictional Region A', cost: 3, reliability: 8, transparency: 7, speed: 5 },
  { id: 's2', name: 'Supplier-002', country: 'Fictional Region B', cost: 7, reliability: 5, transparency: 4, speed: 9 },
  { id: 's3', name: 'Supplier-003', country: 'Fictional Region C', cost: 5, reliability: 9, transparency: 9, speed: 4 },
  { id: 's4', name: 'Supplier-004', country: 'Fictional Region D', cost: 2, reliability: 4, transparency: 3, speed: 7 },
  { id: 's5', name: 'Supplier-005', country: 'Fictional Region E', cost: 6, reliability: 7, transparency: 8, speed: 6 },
];

export type PriorityKey = 'cost' | 'reliability' | 'transparency' | 'speed';

export const PRIORITIES: { key: PriorityKey; label: string; description: string }[] = [
  { key: 'cost', label: 'Cost', description: 'Lower unit price and total landed cost.' },
  { key: 'reliability', label: 'Reliability', description: 'Consistent quality, on-time delivery, and low defect rates.' },
  { key: 'transparency', label: 'Transparency', description: 'Traceability, audit access, and disclosed practices.' },
  { key: 'speed', label: 'Delivery Speed', description: 'Lead time and responsiveness to order changes.' },
];

/* ---- Journal / Ideas ---- */

export const JOURNAL_THEMES = [
  'Sustainability requires shared responsibility rather than pushing costs and risks down the supply chain.',
  'Digital Product Passports can create valuable experiences beyond regulatory compliance.',
  'Sustainability needs stronger business models without losing its ethical purpose.',
];

/* ---- Chapter definitions ---- */

export type Chapter = {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
};

export const CHAPTERS: Chapter[] = [
  { id: 'connector', letter: 'A', title: 'The Connector', subtitle: 'Translation as a way of working' },
  { id: 'operator', letter: 'B', title: 'The Global Operator', subtitle: 'Eight years across sourcing & supply' },
  { id: 'builder', letter: 'C', title: 'The AI Builder', subtitle: 'From research systems to legal intelligence' },
  { id: 'worldpulse', letter: 'D', title: 'WorldPulse', subtitle: 'The future of products tells its own story' },
  { id: 'ideas', letter: 'E', title: 'Ideas, Judgment & the Future', subtitle: 'Where strategy meets stewardship' },
];

/* Journal excerpts shown in chapter E. Where an entry grew out of a real
   post on /blog, `postSlug` links it to the full piece. */
export type JournalEntry = {
  id: string;
  title: string;
  origin: string;
  theme: number;
  body: string[];
  postSlug?: string;
};

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'amsterdam',
    title: 'From Amsterdam: Sustainability as shared responsibility',
    origin: 'Inspired by the Sustainable Apparel & Textiles Conference in Amsterdam',
    theme: 0,
    postSlug: '3-takeaways-from-innovation-forum-s-sustainable-apparel-textiles-conference',
    body: [
      'The conference surfaced a tension that runs through the entire apparel and textile industry. Sustainability is often framed as a compliance burden, and the pressure to meet it gets pushed down the supply chain to suppliers who can least afford to absorb the cost.',
      'The more productive framing is shared responsibility. Brands, manufacturers, logistics providers, and regulators each hold a piece of the solution. No single actor can deliver sustainability alone, and no single actor should bear the full cost of trying.',
      'What makes this practical is data. When supplier practices, material origins, and environmental impacts are visible to all parties, the conversation shifts from blame to coordination. Transparency is not a weapon; it is a meeting point.',
    ],
  },
  {
    id: 'passport-value',
    title: 'Beyond compliance: the product experience opportunity',
    origin: 'On Digital Product Passports and what they make possible',
    theme: 1,
    body: [
      'The default framing of Digital Product Passports is regulatory: meet the requirement, check the box, move on. That framing undersells the concept.',
      'A passport is not just a compliance document. It is a connection point between a product and the person who buys it. The same data that satisfies a regulator can tell a story that builds trust, differentiates a brand, and creates a relationship that lasts beyond the sale.',
      'The insight is that compliance and experience are not separate work streams. They are the same data, presented with different intent. Design decides whether transparency feels like a burden or a gift.',
    ],
  },
  {
    id: 'business-model',
    title: 'Sustainability needs a better business model',
    origin: 'On the economics of ethical supply chains',
    theme: 2,
    body: [
      'The strongest critique of sustainability efforts is not that they are wrong, but that they are economically fragile. When doing the right thing costs more and the customer will not pay for it, the right thing does not scale.',
      'The path forward is not to abandon the ethical purpose, but to build business models that make sustainability the cheaper, faster, or better option. That means using transparency to reduce waste, using traceability to manage risk, and using data to find efficiencies that compliance alone would never surface.',
      'Sustainability without a viable business model depends on charity. Sustainability with one becomes the default. The goal is to make the ethical choice the obvious one.',
    ],
  },
];
