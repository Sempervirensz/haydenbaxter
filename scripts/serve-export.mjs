#!/usr/bin/env node
/**
 * Serves the `output: "export"` build in `out/` the way Vercel serves it.
 *
 * Two reasons this exists instead of `npx --yes serve out`:
 *
 * 1. `npx --yes serve` fetches a package from the network at test time. A
 *    Playwright run should not be able to fail because a registry is slow or
 *    unreachable. This has no dependencies.
 *
 * 2. Static export emits BOTH `foo.html` and a sibling `foo/` asset directory
 *    for the same route. A naive static server hits the directory first and
 *    emits a directory listing, so `/emerging-tech-builds` renders as a page
 *    of file links rather than the real page. That produced two false findings
 *    during the original audit before it was caught. Vercel serves `foo.html`;
 *    so does this.
 *
 * Also replays the redirects and security headers from vercel.json, so tests
 * see the same CSP and the same 308s that production visitors do.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("../out", import.meta.url)));
const VERCEL = path.resolve(fileURLToPath(new URL("../vercel.json", import.meta.url)));
const PORT = Number(process.argv[2] || process.env.PORT || 3100);

const vj = JSON.parse(fs.readFileSync(VERCEL, "utf8"));
const REDIRECTS = new Map((vj.redirects || []).map((r) => [r.source, r.destination]));
const HEADERS = (vj.headers || [])
  .filter((b) => b.source === "/(.*)")
  .flatMap((b) => b.headers)
  // HSTS over plain http locally is meaningless and makes browsers cache an
  // https upgrade for the port, which breaks every later run on that port.
  .filter((h) => h.key !== "Strict-Transport-Security")
  .map((h) => [h.key, h.value])
  .map(([k, v]) => {
    if (k !== "Content-Security-Policy") return [k, v];
    /* Drop `upgrade-insecure-requests` for local http only.
     *
     * Production is https, where the directive is correct and should stay in
     * vercel.json. Over plain http it is actively destructive in WebKit, which
     * applies it to 127.0.0.1 — Chromium exempts localhost, WebKit does not.
     * The result is every chunk, stylesheet and font re-requested as https
     * against an http server: "A TLS error caused the secure connection to
     * fail", a blank page, and ~18 phantom console errors per route that look
     * exactly like a real Safari-only defect.
     *
     * Everything else in the policy is preserved, so tests still exercise the
     * real CSP. */
    return [k, v.split(";").map((d) => d.trim()).filter((d) => d && d !== "upgrade-insecure-requests").join("; ")];
  });

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
};

/** Resolve a URL path to a file on disk using Vercel's static-export rules. */
function resolveFile(urlPath) {
  const rel = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const abs = path.join(ROOT, rel);
  if (!abs.startsWith(ROOT)) return null; // path traversal
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
    const idx = path.join(abs, "index.html");
    if (fs.existsSync(idx)) return idx;
    const sib = abs.replace(/\/$/, "") + ".html"; // foo/ -> foo.html
    if (fs.existsSync(sib)) return sib;
    return null;
  }
  const asHtml = abs.replace(/\/$/, "") + ".html"; // clean URL -> foo.html
  if (fs.existsSync(asHtml)) return asHtml;
  return null;
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];

  if (REDIRECTS.has(urlPath)) {
    res.writeHead(308, { Location: REDIRECTS.get(urlPath) });
    return res.end();
  }

  const file = resolveFile(urlPath === "/" ? "/index.html" : urlPath);
  const send = (code, body, type) => {
    for (const [k, v] of HEADERS) res.setHeader(k, v);
    res.writeHead(code, { "Content-Type": type, "Content-Length": body.length });
    res.end(req.method === "HEAD" ? undefined : body);
  };

  if (!file) {
    const notFound = path.join(ROOT, "404.html");
    const body = fs.existsSync(notFound) ? fs.readFileSync(notFound) : Buffer.from("Not found");
    return send(404, body, "text/html; charset=utf-8");
  }

  const ext = path.extname(file).toLowerCase();
  // The OG image is emitted without an extension; production sets its type in
  // vercel.json, so mirror that rather than falling back to octet-stream.
  const type = urlPath === "/opengraph-image" ? "image/png" : TYPES[ext] || "application/octet-stream";
  send(200, fs.readFileSync(file), type);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`serving ${ROOT} on http://127.0.0.1:${PORT}`);
});
