// Server-rendered JSON-LD block.
//
// `type="application/ld+json"` is a data block, not executable script, so it is
// not subject to the CSP `script-src` in vercel.json. `<` is escaped anyway so
// a value that happened to contain `</script>` can never break out of the
// block and become markup.
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
