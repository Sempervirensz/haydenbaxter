type JsonLdProps = {
  data: unknown;
};

// Serialize JSON-LD without allowing a less-than character to terminate the
// script block if future content ever includes HTML-like text.
export default function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
