export const DEFAULT_SITE_ORIGIN = "https://delta-synth-th.co.th";

function resolveSiteOrigin(value: string | undefined) {
  if (!value) return DEFAULT_SITE_ORIGIN;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : DEFAULT_SITE_ORIGIN;
  } catch {
    return DEFAULT_SITE_ORIGIN;
  }
}

export const siteOrigin = resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL?.trim());
