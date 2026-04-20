export default async function handler(req) {
  console.log("Proxy called with URL:", req.url);

  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: "Missing lat or lon" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const key = process.env.GOOGLE_PLACES_API_KEY;
    console.log("API Key present:", !!key, "Length:", key ? key.length : 0);

    if (!key) {
      return new Response(JSON.stringify({ error: "GOOGLE_PLACES_API_KEY is not set in Vercel Environment Variables" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=3000&type=restaurant&key=${key}`;
    console.log("Calling Google URL:", url.replace(key, "HIDDEN"));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    const data = await response.json();
    console.log("Google response status:", data.status);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Proxy error:", error.message);
    return new Response(JSON.stringify({ error: "Proxy failed: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
