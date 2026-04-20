// api/places.js - Secure Google Places proxy for RushPlate

export default async function handler(req) {
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const lat = params.lat;
    const lon = params.lon;

    if (!lat || !lon) {
      return new Response(
        JSON.stringify({ error: "Missing lat or lon parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const key = process.env.GOOGLE_PLACES_API_KEY;

    if (!key) {
      return new Response(
        JSON.stringify({ error: "GOOGLE_PLACES_API_KEY is missing in Vercel environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=3000&type=restaurant&key=${key}`;

    const response = await fetch(url);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error: " + error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
