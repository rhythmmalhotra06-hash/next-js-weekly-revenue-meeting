const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;
const MEETINGS_TABLE = "tblxsXzMj0wM7sx6Z";
const ACTION_ITEMS_TABLE = "tbl1193a38XZ2hFR1";

function authHeader() {
  return { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` };
}

async function airtableFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${options.method ?? "GET"} ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Field mapping helpers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toAirtableFields(data: any, status?: string): Record<string, unknown> {
  const fields: Record<string, unknown> = {};

  if (data.label !== undefined) fields["Meeting Label"] = data.label ?? "";
  if (data.date !== undefined) fields["Meeting Date"] = data.date ?? null;
  if (status !== undefined) fields["Status"] = status;

  // Plain text extract for Meeting Notes field (Airtable multilineText)
  if (data.meeting_notes !== undefined) {
    fields["Meeting Notes"] =
      typeof data.meeting_notes === "string"
        ? data.meeting_notes
        : JSON.stringify(data.meeting_notes);
  }

  // JSON section blobs
  const jsonSections: [string, string][] = [
    ["company_health", "Company Health JSON"],
    ["bu_performance", "BU Performance JSON"],
    ["membership", "Membership JSON"],
    ["pathways", "Pathways JSON"],
    ["masteries", "Masteries JSON"],
    ["events", "Events JSON"],
    ["states", "States JSON"],
    ["product", "Product JSON"],
    ["section_comments", "Section Comments JSON"],
    ["page_config", "Page Config JSON"],
  ];

  for (const [key, fieldName] of jsonSections) {
    if (data[key] !== undefined) {
      fields[fieldName] = JSON.stringify(data[key]);
    }
  }

  // Action items split fields
  if (data.action_items !== undefined) {
    const ai = data.action_items;
    if (ai.pm_flag_active !== undefined) fields["PM Flag Active"] = !!ai.pm_flag_active;
    if (ai.pm_flag_text !== undefined) fields["PM Flag Text"] = ai.pm_flag_text ?? "";
    if (ai.decisions !== undefined) fields["Decisions JSON"] = JSON.stringify(ai.decisions ?? []);
  }

  return fields;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromAirtableRecord(record: any): any {
  const f = record.fields;

  function parseJSON(raw: unknown) {
    if (!raw) return null;
    try {
      return JSON.parse(raw as string);
    } catch {
      return raw;
    }
  }

  const items: unknown[] = parseJSON(f["action_items_json"]) ?? [];

  return {
    _recordId: record.id,
    label: f["Meeting Label"] ?? "",
    date: f["Meeting Date"] ?? null,
    status: f["Status"] ?? "Draft",
    meeting_notes: parseJSON(f["Meeting Notes"]) ?? f["Meeting Notes"] ?? "",
    company_health: parseJSON(f["Company Health JSON"]),
    bu_performance: parseJSON(f["BU Performance JSON"]),
    membership: parseJSON(f["Membership JSON"]),
    pathways: parseJSON(f["Pathways JSON"]),
    masteries: parseJSON(f["Masteries JSON"]),
    events: parseJSON(f["Events JSON"]),
    states: parseJSON(f["States JSON"]),
    product: parseJSON(f["Product JSON"]),
    section_comments: parseJSON(f["Section Comments JSON"]) ?? {},
    page_config: parseJSON(f["Page Config JSON"]) ?? {},
    action_items: {
      pm_flag_active: !!f["PM Flag Active"],
      pm_flag_text: f["PM Flag Text"] ?? "",
      decisions: parseJSON(f["Decisions JSON"]) ?? [],
      items,
      next_id: items.length > 0
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? Math.max(...(items as any[]).map((i: any) => Number(i.id ?? 0))) + 1
        : 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getDraftMeeting() {
  const url =
    `/${MEETINGS_TABLE}?filterByFormula=${encodeURIComponent('{Status}="Draft"')}` +
    `&sort[0][field]=Created+At&sort[0][direction]=desc&maxRecords=1`;
  const data = await airtableFetch(url);
  if (!data.records || data.records.length === 0) return null;

  const meeting = fromAirtableRecord(data.records[0]);
  // Hydrate action items from linked Action Items table
  const linkedIds: string[] = data.records[0].fields["Action Items"] ?? [];
  if (linkedIds.length > 0) {
    meeting.action_items.items = await fetchActionItemsByIds(linkedIds);
    meeting.action_items.next_id =
      meeting.action_items.items.length > 0
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? Math.max(...meeting.action_items.items.map((i: any) => Number(i.id ?? 0))) + 1
        : 1;
  }

  return meeting;
}

export async function getMeetingById(recordId: string) {
  const data = await airtableFetch(`/${MEETINGS_TABLE}/${recordId}`);
  const meeting = fromAirtableRecord(data);
  const linkedIds: string[] = data.fields["Action Items"] ?? [];
  if (linkedIds.length > 0) {
    meeting.action_items.items = await fetchActionItemsByIds(linkedIds);
  }
  return meeting;
}

export async function createMeeting(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  status: "Draft" | "Finalized"
): Promise<string> {
  const fields = toAirtableFields(data, status);
  const res = await airtableFetch(`/${MEETINGS_TABLE}`, {
    method: "POST",
    body: JSON.stringify({ fields }),
  });
  return res.id as string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateMeeting(recordId: string, data: any, status?: string) {
  const fields = toAirtableFields(data, status);
  await airtableFetch(`/${MEETINGS_TABLE}/${recordId}`, {
    method: "PATCH",
    body: JSON.stringify({ fields }),
  });
}

export async function listFinalizedMeetings() {
  const url =
    `/${MEETINGS_TABLE}?filterByFormula=${encodeURIComponent('{Status}="Finalized"')}` +
    `&sort[0][field]=Meeting+Date&sort[0][direction]=desc` +
    `&fields[]=Meeting+Label&fields[]=Meeting+Date&fields[]=Created+At`;
  const data = await airtableFetch(url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.records ?? []).map((r: any) => ({
    id: r.id,
    label: r.fields["Meeting Label"] ?? "",
    date: r.fields["Meeting Date"] ?? "",
    savedAt: r.fields["Created At"] ?? "",
  }));
}

export async function deleteMeeting(recordId: string) {
  // First delete all linked action items
  const record = await airtableFetch(`/${MEETINGS_TABLE}/${recordId}`);
  const linkedIds: string[] = record.fields["Action Items"] ?? [];
  if (linkedIds.length > 0) {
    await deleteActionItemsBatch(linkedIds);
  }
  await airtableFetch(`/${MEETINGS_TABLE}/${recordId}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Action Items
// ---------------------------------------------------------------------------

async function fetchActionItemsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  // Airtable allows fetching multiple records via filterByFormula OR(RECORD_ID()=...)
  const formula = `OR(${ids.map((id) => `RECORD_ID()="${id}"`).join(",")})`;
  const url = `/${ACTION_ITEMS_TABLE}?filterByFormula=${encodeURIComponent(formula)}`;
  const data = await airtableFetch(url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.records ?? []).map((r: any) => ({
    _airtableId: r.id,
    id: r.fields["id"] ?? r.id, // use numeric id if stored, else record id
    title: r.fields["Title"] ?? "",
    note: r.fields["Note"] ?? "",
    owner: r.fields["Owner"] ?? "",
    supporting: r.fields["Supporting"] ?? "",
    due_date: r.fields["Due Date"] ?? "",
    priority: r.fields["Priority"] ?? "Medium",
    status: r.fields["Status"] ?? "Open",
    okr: r.fields["OKR"] ?? "",
    flagged: !!r.fields["Flagged"],
  }));
}

async function deleteActionItemsBatch(ids: string[]) {
  // Airtable DELETE supports up to 10 records per request
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const qs = batch.map((id) => `records[]=${id}`).join("&");
    await airtableFetch(`/${ACTION_ITEMS_TABLE}?${qs}`, { method: "DELETE" });
  }
}

export async function upsertActionItems(
  meetingRecordId: string,
  meetingLabel: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previousItems: any[] = []
): Promise<any[]> {
  const toCreate = items.filter((i) => !i._airtableId);
  const toUpdate = items.filter((i) => !!i._airtableId);

  // Delete items that were removed (in previousItems but not in current items)
  const currentAirtableIds = new Set(items.map((i) => i._airtableId).filter(Boolean));
  const toDelete = previousItems
    .filter((i) => i._airtableId && !currentAirtableIds.has(i._airtableId))
    .map((i) => i._airtableId);

  if (toDelete.length > 0) {
    await deleteActionItemsBatch(toDelete);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function itemToFields(item: any) {
    return {
      Title: item.title ?? "",
      Note: item.note ?? "",
      Owner: item.owner ?? "",
      Supporting: item.supporting ?? "",
      "Due Date": item.due_date ?? "",
      Priority: item.priority ?? "Medium",
      Status: item.status ?? "Open",
      OKR: item.okr ?? "",
      Flagged: !!item.flagged,
      "Meeting Label": meetingLabel,
      Meeting: [meetingRecordId],
    };
  }

  // Create new items in batches of 10
  const createdIds: string[] = [];
  for (let i = 0; i < toCreate.length; i += 10) {
    const batch = toCreate.slice(i, i + 10);
    const res = await airtableFetch(`/${ACTION_ITEMS_TABLE}`, {
      method: "POST",
      body: JSON.stringify({ records: batch.map((item) => ({ fields: itemToFields(item) })) }),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createdIds.push(...(res.records ?? []).map((r: any) => r.id));
  }

  // Patch existing items in batches of 10
  for (let i = 0; i < toUpdate.length; i += 10) {
    const batch = toUpdate.slice(i, i + 10);
    await airtableFetch(`/${ACTION_ITEMS_TABLE}`, {
      method: "PATCH",
      body: JSON.stringify({
        records: batch.map((item) => ({ id: item._airtableId, fields: itemToFields(item) })),
      }),
    });
  }

  // Return items with _airtableId populated for newly created ones
  let createIdx = 0;
  return items.map((item) => {
    if (!item._airtableId) {
      return { ...item, _airtableId: createdIds[createIdx++] };
    }
    return item;
  });
}
