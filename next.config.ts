import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
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
