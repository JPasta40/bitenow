export default async function handler(req) {
  // Hard timeout to prevent Vercel timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000); // 7 seconds max

  try {
    const lat = "41.8240";
    const lon = "-71.4128";

    const key = process.env.GOOGLE_PLACES_API_KEY;

    if (!key) {
      clearTimeout(timeoutId);
      return new Response(JSON.stringify({ error: "API key not found in env vars" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=3000&type=restaurant&key=${key}`;

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Proxy error:", error.message);
    return new Response(JSON.stringify({ error: error.message || "Timeout or fetch failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
