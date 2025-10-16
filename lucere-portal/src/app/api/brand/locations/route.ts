import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const brand = decodeURIComponent((cookie.match(/(?:^|; )ldm_customer_name=([^;]+)/)?.[1] || "")).trim();
  if (!brand) return NextResponse.json({ points: [] });

  const { data: cust } = await supabaseAdmin.from('customers').select('id').eq('name', brand).maybeSingle();
  if (!cust?.id) return NextResponse.json({ points: [] });

  const { data: locs } = await supabaseAdmin
    .from('locations')
    .select('id,name,city,latitude,longitude')
    .eq('customer_id', cust.id);

  // Aggregate recent impressions by location
  const start = new Date();
  start.setDate(start.getDate()-30);
  const startStr = start.toISOString().slice(0,10);
  const { data: mets } = await supabaseAdmin
    .from('metrics')
    .select('location_id,impressions,date')
    .gte('date', startStr);

  const sumByLoc = new Map<string, number>();
  for (const m of mets || []) {
    if (!m.location_id) continue;
    sumByLoc.set(m.location_id as any, (sumByLoc.get(m.location_id as any) || 0) + Number((m as any).impressions || 0));
  }

  const points = (locs || [])
    .filter((l: any) => l.latitude && l.longitude)
    .map((l: any) => ({
      name: l.name,
      lat: Number(l.latitude),
      lng: Number(l.longitude),
      city: l.city || '-',
      impressions: sumByLoc.get(l.id) || 0,
    }));

  return NextResponse.json({ points });
}


