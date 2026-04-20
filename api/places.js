export default async function handler(req) {
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const lat = params.lat;
    const lon = params.lon;

    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: "Missing lat or lon" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const key = process.env.GOOGLE_PLACES_API_KEY;

    if (!key) {
      return new Response(JSON.stringify({ error: "GOOGLE_PLACES_API_KEY missing in Vercel env vars" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=3000&type=restaurant&key=${key}`;

    const res = await fetch(url);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
