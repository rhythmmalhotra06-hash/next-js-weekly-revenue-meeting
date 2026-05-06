import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = `You are an assistant that parses meeting transcripts and extracts structured data.
From the transcript extract:
1. All action items — concrete tasks someone committed to
2. All decisions required — unresolved items that need an exec call

Return ONLY valid JSON in this exact shape (no markdown, no explanation):
{
  "items": [
    {
      "title": "short imperative sentence",
      "note": "detail or context from the transcript",
      "owner": "person's name",
      "supporting": "others involved or —",
      "due": "Month Day e.g. May 13",
      "okr": "one of: Revenue Protection | Revenue Forecast | Lead Generation | Launch Execution | Platform Readiness | Data & Reporting | Cash Management | Execution Cadence | Ops Clarity | Summit Experience",
      "priority": "Critical | High | Medium",
      "status": "Open",
      "flagged": false
    }
  ],
  "decisions": [
    {
      "id": "unique short string",
      "title": "decision needed in one line",
      "body": "context — what's blocked, who decides, what the options are"
    }
  ]
}

Rules:
- Only include genuine action items (someone agreed to do something with a clear owner)
- priority = Critical if explicitly urgent/blocking, High if important, Medium otherwise
- due = best estimate from the transcript; use "TBD" if not mentioned
- flagged = true only if the transcript marks it as urgent or critical
- Return empty arrays if none found — never return null`;

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not set in .env.local" },
      { status: 500 }
    );
  }

  try {
    const { transcript } = await req.json();
    if (!transcript?.trim()) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: key });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: "user", content: `Transcript:\n\n${transcript}` }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[POST /api/parse-transcript]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
