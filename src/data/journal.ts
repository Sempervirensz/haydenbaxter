export interface JournalPost {
  title: string;
  date: string;
  excerpt: string;
  href: string;
  image: string;
}

export const JOURNAL_DATA = {
  heading: "Journal",
  subline: "Long-form thinking on AI, supply chain, and building products that matter.",
  blogUrl: "https://journal.haydenbaxter.com",
  blogLabel: "Read the full journal",
  posts: [
    {
      title: "Artificial Intelligence and the Architecture of Industry",
      date: "Mar 6, 2026",
      excerpt:
        "How AI reshapes industrial structures, organizational frameworks, and the operating logic behind modern supply chains.",
      href: "https://journal.haydenbaxter.com/p/artificial-intelligence-and-the-architecture-of-industry",
      image:
        "https://beehiiv-images-production.s3.amazonaws.com/uploads/publication/thumbnail/7126350d-f53b-47b2-bd7f-7df9d174530b/landscape_hf_20260219_214719_e56c2594-5d63-4cd8-8161-f495032a10eb.jpeg",
    },
  ] as JournalPost[],
};
