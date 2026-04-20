 apiplaces.js  ← This runs on Vercel servers only (key stays hidden)

export default async function handler(req) {
  const { lat, lon, radius = 3000 } = Object.fromEntries(new URL(req.url).searchParams);

  if (!lat  !lon) {
    return new Response(JSON.stringify({ error Missing lat or lon }), { 
      status 400,
      headers { Content-Type applicationjson }
    });
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;   Secure env variable

  if (!GOOGLE_API_KEY) {
    return new Response(JSON.stringify({ error Server configuration error }), { 
      status 500,
      headers { Content-Type applicationjson }
    });
  }

  const url = `httpsmaps.googleapis.commapsapiplacenearbysearchjsonlocation=${lat},${lon}&radius=${radius}&type=restaurant&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status 200,
      headers { 
        Content-Type applicationjson,
        Access-Control-Allow-Origin     Allow your frontend to call it
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error Failed to fetch from Google }), { 
      status 500,
      headers { Content-Type applicationjson }
    });
  }
}