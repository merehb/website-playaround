import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Accept CSV text; detect by headers and insert accordingly.
export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  if (!/ldm_admin=1/.test(cookie)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  // Accept either raw text/csv body or multipart form-data with a file
  const ctype = req.headers.get("content-type") || "";
  let text = "";
  let replace = false;
  if (ctype.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 });
    text = await file.text();
    replace = String(form.get('replace') || '').toLowerCase() === 'true';
  } else {
    text = await req.text();
  }
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.trim().toLowerCase());

  function cells(line: string) { return line.split(",").map((c) => c.trim()); }
  const normDate = (s: any) => {
    if (!s) return null as any;
    const str = String(s).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const m = str.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
    if (m) {
      const mm = m[1].padStart(2,'0');
      const dd = m[2].padStart(2,'0');
      let yy = m[3];
      if (yy.length === 2) yy = '20' + yy;
      return `${yy}-${mm}-${dd}`;
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0,10);
    return null as any;
  };

  if (headers.includes("username") || headers.includes("access_code") || headers.includes("password")) {
    // master.csv: customer,username,access_code(or password),location_name,city,state,venue_type,campaign_name,start_date,end_date,date,impressions
    const idx = (name: string) => headers.indexOf(name);
    const rows = lines.map((l) => cells(l));
    for (const row of rows) {
      const customer = row[idx("customer")] || row[idx("brand")] || "";
      const username = row[idx("username")] || customer;
      const access_code = row[idx("access_code")] || row[idx("password")] || "";
      const location_name = row[idx("location_name")] || "";
      const city = row[idx("city")] || "";
      const state = row[idx("state")] || "";
      const venue_type = row[idx("venue_type")] || row[idx("type")] || "";
      const campaign_name = row[idx("campaign_name")] || "";
      const start_date = normDate(row[idx("start_date")] || null);
      const end_date = normDate(row[idx("end_date")] || null);
      const date = normDate(row[idx("date")] || null);
      const impressions = Number(row[idx("impressions")] || 0);
      const reach = Number(row[idx("reach")] || 0);
      const visits = Number(row[idx("visits")] || 0);
      const conversions = Number(row[idx("conversions")] || 0);

      if (!customer) continue;
      // ensure customer
      let { data: cust } = await supabaseAdmin.from("customers").select("id").eq("name", customer).maybeSingle();
      if (!cust?.id) {
        const ins = await supabaseAdmin.from("customers").insert({ name: customer }).select("id").single();
        if (ins.error) continue; else cust = { id: ins.data.id } as any;
      }
      // ensure access code
      if (access_code) {
        const { data: existing } = await supabaseAdmin.from("access_codes").select("id").eq("customer_id", cust.id).eq("code", access_code).maybeSingle();
        if (!existing?.id) await supabaseAdmin.from("access_codes").insert({ customer_id: cust.id, code: access_code, active: true });
      }
      // ensure campaign
      if (replace && campaign_name) {
        // delete existing metrics for this campaign_name under this customer
        const { data: cids } = await supabaseAdmin.from('campaigns').select('id').eq('customer_id', cust.id).eq('name', campaign_name);
        const ids = (cids || []).map((c: any) => c.id);
        if (ids.length) await supabaseAdmin.from('metrics').delete().in('campaign_id', ids);
      }
      let { data: camp } = await supabaseAdmin.from("campaigns").select("id").eq("customer_id", cust.id).eq("name", campaign_name).maybeSingle();
      if (!camp?.id && campaign_name) {
        const ins = await supabaseAdmin.from("campaigns").insert({ customer_id: cust.id, name: campaign_name, start_date, end_date }).select("id").single();
        if (!ins.error) camp = { id: ins.data.id } as any;
      }
      // ensure location
      let { data: loc } = await supabaseAdmin.from("locations").select("id").eq("customer_id", cust.id).eq("name", location_name).maybeSingle();
      if (!loc?.id && location_name) {
        const ins = await supabaseAdmin.from("locations").insert({ customer_id: cust.id, name: location_name, city: city && state ? `${city}, ${state}` : city || state, type: venue_type }).select("id").single();
        if (!ins.error) loc = { id: ins.data.id } as any;
      }
      // metric
      if (date && camp?.id) {
        await supabaseAdmin.from("metrics").insert({ campaign_id: camp.id, location_id: loc?.id || null, date, impressions, reach, visits, conversions });
      }
    }
    return NextResponse.json({ ok: true, mode: "master" });
  }

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


