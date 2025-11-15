export const runtime = "edge";

export async function POST(req) {
  try {
    const { text, tone } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Invalid text" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Simple placeholder humanization algorithm on the server side.
    const normalizedTone = ["neutral", "friendly", "professional", "casual"].includes(tone)
      ? tone
      : "neutral";

    let prefix = "";
    switch (normalizedTone) {
      case "friendly":
        prefix = "Hey there! ";
        break;
      case "professional":
        prefix = "In summary, ";
        break;
      case "casual":
        prefix = "So, ";
        break;
      default:
        prefix = "";
    }

    // Very naive transformation: trim, fix spacing, remove excessive jargon-like words
    const cleaned = text
      .trim()
      .replace(/\s+/g, " ")
      .replace(/utilize/g, "use")
      .replace(/leverag(e|ing)/g, "use")
      .replace(/paradigm/g, "approach")
      .replace(/synergy/g, "teamwork");

    const result = `${prefix}${cleaned}`;

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to humanize" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}