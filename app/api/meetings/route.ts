import { NextRequest, NextResponse } from "next/server";
import {
  getDraftMeeting,
  listFinalizedMeetings,
  createMeeting,
} from "@/lib/airtable";

export async function GET(req: NextRequest) {
  try {
    const draft = req.nextUrl.searchParams.get("draft");
    if (draft === "1") {
      const meeting = await getDraftMeeting();
      return NextResponse.json(meeting ?? null);
    }
    const meetings = await listFinalizedMeetings();
    return NextResponse.json(meetings);
  } catch (err) {
    console.error("[GET /api/meetings]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const recordId = await createMeeting(body.data ?? {}, body.status ?? "Draft");
    return NextResponse.json({ recordId });
  } catch (err) {
    console.error("[POST /api/meetings]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
