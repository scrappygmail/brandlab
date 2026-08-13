// functions/api/ai-advisor.js
//
// This is a Cloudflare Pages Function (plain JavaScript, runs on Cloudflare's
// edge — NOT Python, fully compatible with the free Cloudflare Pages tier).
// It exists so BrandLab can offer OPTIONAL AI opinions (slogans, positioning,
// industry fit) without ever putting your Anthropic API key in the browser,
// where any visitor could open dev tools and steal it.
//
// This endpoint is NOT wired up automatically. To enable it:
//
//   1. In the Cloudflare dashboard, open your Pages project.
//   2. Go to Settings -> Environment variables -> Add variable.
//      Name:  ANTHROPIC_API_KEY
//      Value: your real Anthropic API key
//      Mark it "Encrypt" / secret.
//   3. Re-deploy (or it applies on next deploy).
//   4. That's it — this file will now respond at /api/ai-advisor.
//
// Until you do this, the AI Advisor toggle on the site will simply say
// "no backend connected yet" and every deterministic score keeps working
// exactly as before. Nothing breaks if you skip this step.

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured on this Pages project yet." }),
      { status: 501, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Simple health check ping from the frontend toggle.
  if (body.ping) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const name = (body.name || "").toString().slice(0, 40);
  if (!name) {
    return new Response(JSON.stringify({ error: "Missing 'name' field." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prompt = `You are a branding consultant. For the invented brand name "${name}", give:
1. One short slogan (max 8 words)
2. One likely target industry
3. A one-sentence positioning idea
Reply ONLY as JSON: {"slogan": "...", "industry": "...", "positioning": "..."}
These are creative opinions only, not facts.`;

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await anthropicRes.json();
    const textBlock = (data.content || []).find((b) => b.type === "text");

    return new Response(
      JSON.stringify({ ok: true, raw: textBlock ? textBlock.text : "" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "Upstream request failed." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
