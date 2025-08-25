export const config = { runtime: "edge" };

const ALLOWED = [
  "https://binaryx-com-new.webflow.io",
  "https://binaryx.com"
];

export default async function handler(req) {
  const origin = req.headers.get("Origin") || "";
  const allowOrigin = ALLOWED.includes(origin) ? origin : ALLOWED[0];

  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin"
      }
    });
  }

  const upstream = "https://api.binaryx.com/integrations/landing";
  const r = await fetch(upstream, { headers: { Accept: "application/json" } });
  const body = await r.text();

  return new Response(body, {
    status: r.status,
    headers: {
      "Content-Type": r.headers.get("content-type") || "application/json",
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, max-age=300",
      "Vary": "Origin"
    }
  });
}
