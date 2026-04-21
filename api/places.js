export default async function handler(req) {
  // Force a quick response if something goes wrong
  const timeout = setTimeout(() => {
    return new Response(JSON.stringify({ error: "Timeout - function took too long" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }, 8000);

  try {
    // Safest way to get query params on Vercel
    let lat = null;
    let lon = null;

    if (req.url) {
      const urlParts = req.url.split('?');
      if (urlParts[1]) {
        const params = new URLSearchParams(urlParts[1]);
        lat = params.get('lat');
        lon = params.get('lon');
      }
    }

    if (!lat || !lon) {
      clearTimeout(timeout);
      return new Response(JSON.stringify({ error: "Missing lat or lon" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const key = process.env.GOOGLE_PLACES_API_KEY;

    if (!key) {
      clearTimeout(timeout);
      return new Response(JSON.stringify({ error: "GOOGLE_PLACES_API_KEY is not set in Vercel Environment Variables" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=3000&type=restaurant&key=${key}`;

    const response = await fetch(googleUrl);
    const data = await response.json();

    clearTimeout(timeout);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    clearTimeout(timeout);
    console.error("Proxy error:", error.message);
    return new Response(JSON.stringify({ error: "Proxy failed: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
