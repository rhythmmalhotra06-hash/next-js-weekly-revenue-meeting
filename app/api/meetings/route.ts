import { NextRequest, NextResponse } from "next/server";
import {
  getDraftMeeting,
  listAllMeetings,
  createMeeting,
  getMeetingByDate,
} from "@/lib/airtable";

export async function GET(req: NextRequest) {
  try {
    const draft = req.nextUrl.searchParams.get("draft");
    if (draft === "1") {
      const meeting = await getDraftMeeting();
      return NextResponse.json(meeting ?? null);
    }
    const meetings = await listAllMeetings();
    return NextResponse.json(meetings);
  } catch (err) {
    console.error("[GET /api/meetings]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = body.data ?? {};
    const status = body.status ?? "Draft";

    // Upsert: if a record already exists for this date, return it as-is
    const date = data.meeting_date ?? data.date ?? null;
    if (date) {
      const existingId = await getMeetingByDate(date);
      if (existingId) {
        return NextResponse.json({ recordId: existingId, isNew: false });
      }
    }

    const recordId = await createMeeting(data, status);
    return NextResponse.json({ recordId, isNew: true });
  } catch (err) {
    console.error("[POST /api/meetings]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
