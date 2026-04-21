export default async function handler(req) {
  try {
    // Safe query param extraction (works on Vercel)
    let lat, lon;

    if (req.nextUrl) {
      lat = req.nextUrl.searchParams.get('lat');
      lon = req.nextUrl.searchParams.get('lon');
    } else {
      const searchParams = new URLSearchParams(req.url.split('?')[1] || '');
      lat = searchParams.get('lat');
      lon = searchParams.get('lon');
    }

    if (!lat || !lon) {
      return new Response(
        JSON.stringify({ error: "Missing lat or lon" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const key = process.env.GOOGLE_PLACES_API_KEY;

    if (!key) {
      return new Response(
        JSON.stringify({ error: "GOOGLE_PLACES_API_KEY is not set in Vercel Environment Variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=3000&type=restaurant&key=${key}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(googleUrl, { signal: controller.signal });
    clearTimeout(timeout);

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Proxy error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown proxy error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
