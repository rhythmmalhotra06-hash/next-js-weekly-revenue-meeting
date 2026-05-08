import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const maxDuration = 60;

async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());
  if (name.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return value;
  }
  // Treat .txt / .vtt / .srt / .md / unknown as utf-8 text
  return buf.toString("utf-8");
}

const OKRS = [
  "Revenue Protection",
  "Revenue Forecast",
  "Lead Generation",
  "Launch Execution",
  "Platform Readiness",
  "Data & Reporting",
  "Cash Management",
  "Execution Cadence",
  "Ops Clarity",
  "Summit Experience",
] as const;

const SYSTEM = `You are an assistant that parses meeting transcripts and extracts structured data.
From the transcript extract:
1. All action items — concrete tasks someone committed to (with a clear owner)
2. All decisions required — unresolved items that need an exec call

Rules:
- Only include genuine action items (someone agreed to do something with a clear owner)
- priority = "Critical" if explicitly urgent/blocking, "High" if important, "Medium" otherwise
- due = best estimate from the transcript (e.g. "May 13"); use "TBD" if not mentioned
- flagged = true only if the transcript marks it as urgent or critical
- supporting = others involved, or "—" if none
- okr = pick the single best fit from the allowed list
- Return empty arrays if none found — never return null`;

const SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Short imperative sentence" },
          note: { type: "string", description: "Detail or context from the transcript" },
          owner: { type: "string", description: "Person's name" },
          supporting: { type: "string", description: "Others involved, or '—'" },
          due: { type: "string", description: "Month Day e.g. May 13, or TBD" },
          okr: { type: "string", enum: OKRS },
          priority: { type: "string", enum: ["Critical", "High", "Medium"] },
          status: { type: "string", enum: ["Open"] },
          flagged: { type: "boolean" },
        },
        required: [
          "title",
          "note",
          "owner",
          "supporting",
          "due",
          "okr",
          "priority",
          "status",
          "flagged",
        ],
        additionalProperties: false,
      },
    },
    decisions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "Unique short string" },
          title: { type: "string", description: "Decision needed in one line" },
          body: {
            type: "string",
            description: "Context — what's blocked, who decides, what the options are",
          },
        },
        required: ["id", "title", "body"],
        additionalProperties: false,
      },
    },
  },
  required: ["items", "decisions"],
  additionalProperties: false,
};

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not set in .env.local" },
      { status: 500 }
    );
  }

  try {
    const ct = req.headers.get("content-type") || "";
    let transcript: string | undefined;

    if (ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      const file = fd.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }
      try {
        transcript = await extractText(file);
      } catch (err) {
        return NextResponse.json(
          { error: `Could not extract text from ${file.name}: ${(err as Error).message}` },
          { status: 400 }
        );
      }
    } else {
      const body = await req.json();
      transcript = body.transcript;
    }

    if (!transcript?.trim()) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: key });
    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      system: [
        {
          type: "text",
          text: SYSTEM,
          cache_control: { type: "ephemeral" },
        },
      ],
      output_config: {
        format: { type: "json_schema", schema: SCHEMA },
      },
      messages: [
        { role: "user", content: `Transcript:\n\n${transcript}` },
      ],
    });

    const msg = await stream.finalMessage();
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[POST /api/parse-transcript]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
