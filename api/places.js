export default async function handler(req) {
  try {
    // More reliable way to get query parameters in Vercel
    const lat = req.nextUrl ? req.nextUrl.searchParams.get('lat') : null;
    const lon = req.nextUrl ? req.nextUrl.searchParams.get('lon') : null;

    // Fallback method
    if (!lat || !lon) {
      const url = new URL(req.url, `https://${req.headers.get('host') || 'rushplate.vercel.app'}`);
      lat = url.searchParams.get('lat');
      lon = url.searchParams.get('lon');
    }

    if (!lat || !lon) {
      return new Response(
        JSON.stringify({ error: "Missing lat or lon parameters" }),
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

    const response = await fetch(googleUrl, { 
      signal: AbortSignal.timeout(8000) 
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Proxy error:", error.message);
    return new Response(
      JSON.stringify({ error: "Proxy failed: " + error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
