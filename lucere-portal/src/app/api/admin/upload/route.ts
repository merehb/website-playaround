import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Accept CSV text; detect by headers and insert accordingly.
export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  if (!/ldm_admin=1/.test(cookie)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const text = await req.text();
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.trim().toLowerCase());

  function cells(line: string) { return line.split(",").map((c) => c.trim()); }

  if (headers.includes("campaign_name") && headers.includes("start_date")) {
    // campaigns.csv
    const rows = lines.map((l) => cells(l)).map(([customer, name, start_date, end_date]) => ({ customer, name, start_date, end_date }));
    for (const r of rows) {
      const { data: cust } = await supabaseAdmin.from("customers").select("id").eq("name", r.customer).maybeSingle();
      if (!cust?.id) continue;
      await supabaseAdmin.from("campaigns").insert({ customer_id: cust.id, name: r.name, start_date: r.start_date || null, end_date: r.end_date || null });
    }
    return NextResponse.json({ ok: true });
  }

  if (headers.includes("location_name") && headers.includes("type")) {
    // locations.csv
    const rows = lines.map((l) => cells(l)).map(([customer, name, city, type]) => ({ customer, name, city, type }));
    for (const r of rows) {
      const { data: cust } = await supabaseAdmin.from("customers").select("id").eq("name", r.customer).maybeSingle();
      if (!cust?.id) continue;
      await supabaseAdmin.from("locations").insert({ customer_id: cust.id, name: r.name, city: r.city, type: r.type });
    }
    return NextResponse.json({ ok: true });
  }

  if (headers.includes("impressions") && headers.includes("date")) {
    // metrics.csv
    const rows = lines.map((l) => cells(l)).map(([customer, campaign_name, location_name, date, impressions]) => ({ customer, campaign_name, location_name, date, impressions: Number(impressions) }));
    for (const r of rows) {
      const { data: cust } = await supabaseAdmin.from("customers").select("id").eq("name", r.customer).maybeSingle();
      if (!cust?.id) continue;
      const { data: camp } = await supabaseAdmin.from("campaigns").select("id").eq("customer_id", cust.id).eq("name", r.campaign_name).maybeSingle();
      const { data: loc } = await supabaseAdmin.from("locations").select("id").eq("customer_id", cust.id).eq("name", r.location_name).maybeSingle();
      await supabaseAdmin.from("metrics").insert({ campaign_id: camp?.id || null, location_id: loc?.id || null, date: r.date, impressions: r.impressions });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ message: "Unknown CSV format" }, { status: 400 });
}


