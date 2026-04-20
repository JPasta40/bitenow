export default async function handler(req) {
  return new Response(
    JSON.stringify({
      status: "Proxy is running",
      message: "If you see this, the function works. Now checking API key...",
      keyPresent: !!process.env.GOOGLE_PLACES_API_KEY,
      keyLength: process.env.GOOGLE_PLACES_API_KEY ? process.env.GOOGLE_PLACES_API_KEY.length : 0
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
