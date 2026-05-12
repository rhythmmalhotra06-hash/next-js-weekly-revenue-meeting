import { NextRequest, NextResponse } from "next/server";
import {
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  upsertActionItems,
} from "@/lib/airtable";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const meeting = await getMeetingById(id);
    return NextResponse.json(meeting);
  } catch (err) {
    console.error("[GET /api/meetings/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = body.data ?? {};
    const status = body.status;

    await updateMeeting(id, data, status);

    // Upsert action items if present — isolated so a failure here doesn't
    // hide the fact that updateMeeting already succeeded above.
    if (data.action_items?.items) {
      try {
        const updatedItems = await upsertActionItems(
          id,
          data.meeting_label ?? data.label ?? "",
          data.action_items.items,
          body.previousItems ?? []
        );
        return NextResponse.json({ ok: true, items: updatedItems });
      } catch (itemsErr) {
        console.error("[PUT /api/meetings/:id] upsertActionItems failed:", itemsErr);
        // meeting data was already saved — return ok so the client clears localDirty
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/meetings/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMeeting(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/meetings/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
