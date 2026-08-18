import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Escape hatch for running a second dev server against this folder.
  //
  // Two `next dev` processes share `.next` and fight over it: the symptom is a
  // route that exists flapping between 200 and 404 while the log repeats
  // "Fast Refresh had to perform a full reload". A different --port does NOT
  // fix that, because the port was never the thing being contended.
  //
  // Set NEXT_DIST_DIR to give a server its own build directory and the two stop
  // colliding. Unset — which is every normal run, dev or prod — this is
  // exactly `.next` and nothing changes.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Only static-export for production builds. In dev we want a normal Next
  // server so the /api/admin/publish route handler (force-dynamic) runs.
  ...(isDev ? {} : { output: "export" as const }),
  images: {
    unoptimized: true, // required for static export; real savings come from pre-compressed WebP
  },
  // Files ending in `.dev.tsx` / `.dev.ts` are only registered as routes in dev.
  // This keeps the /admin composer + /api/admin/publish handler out of the
  // static-export prod build (which doesn't support route handlers).
  pageExtensions: isDev ? ["dev.tsx", "dev.ts", "tsx", "ts"] : ["tsx", "ts"],
};

export default nextConfig;
