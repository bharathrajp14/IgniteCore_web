import { NextRequest } from "next/server";

function normalizeUrl(value?: string | null) {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function normalizeHost(value?: string | null) {
  if (!value) return "";
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/:\d+$/, "");
}

export function isAllowedRequestOrigin(req: NextRequest) {
  const originHeader = req.headers.get("origin");
  if (!originHeader) return true;

  const originUrl = normalizeUrl(originHeader);
  if (!originUrl) return false;

  if (originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1") {
    return true;
  }

  const configuredHosts = new Set<string>([
    normalizeHost(process.env.NEXT_PUBLIC_SITE_DOMAIN),
    normalizeHost(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    normalizeHost(process.env.VERCEL_URL),
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL)?.hostname || "",
  ]);

  configuredHosts.delete("");

  if (configuredHosts.has(originUrl.hostname)) {
    return true;
  }

  for (const host of configuredHosts) {
    if (host.startsWith("www.")) {
      if (originUrl.hostname === host.replace(/^www\./, "")) return true;
      continue;
    }

    if (originUrl.hostname === `www.${host}`) {
      return true;
    }
  }

  if (originUrl.hostname.endsWith(".vercel.app")) {
    return true;
  }

  return false;
}
