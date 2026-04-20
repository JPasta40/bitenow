export default async function handler(req) {
  return new Response(
    JSON.stringify({
      status: "success",
      message: "Backend proxy is now running correctly!",
      timestamp: new Date().toISOString(),
      note: "If you see this, the function works. We can add Google call next."
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
