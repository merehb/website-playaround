import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const brand = decodeURIComponent((cookie.match(/(?:^|; )ldm_customer_name=([^;]+)/)?.[1] || "")).trim();
  if (!brand) return NextResponse.json({ rows: [] });
  const { data: cust } = await supabaseAdmin.from('customers').select('id').eq('name', brand).maybeSingle();
  if (!cust?.id) return NextResponse.json({ rows: [] });

  const { data: campaigns } = await supabaseAdmin.from('campaigns').select('id,name,start_date,end_date').eq('customer_id', cust.id);
  const cmap = new Map<string, any>();
  for (const c of campaigns || []) cmap.set(c.id, c);

  const { data: locations } = await supabaseAdmin.from('locations').select('id,name,city').eq('customer_id', cust.id);
  const lmap = new Map<string, any>();
  for (const l of locations || []) lmap.set(l.id, l);

  const campaignIds = (campaigns || []).map((c: any) => c.id);
  const { data: metrics } = await supabaseAdmin
    .from('metrics')
    .select('campaign_id,location_id,impressions')
    .in('campaign_id', campaignIds);

  const rows: any[] = [];
  for (const m of metrics || []) {
    const c = cmap.get(m.campaign_id); const l = lmap.get(m.location_id);
    if (!c) continue;
    rows.push({
      campaign_name: c.name,
      start_date: c.start_date,
      end_date: c.end_date,
      location_name: l?.name || '-',
      city: l?.city || '-',
      impressions: m.impressions || 0,
    });
  }
  // If there are campaigns but no metrics, still show campaigns
  if ((metrics || []).length === 0) {
    for (const c of campaigns || []) {
      rows.push({
        campaign_name: c.name,
        start_date: c.start_date,
        end_date: c.end_date,
        location_name: '-',
        city: '-',
        impressions: 0,
      });
    }
  }
  return NextResponse.json({ rows });
}


