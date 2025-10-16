import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  if (!/ldm_admin=1/.test(cookie)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const brand = url.searchParams.get('brand')?.trim();
  if (!brand) return NextResponse.json({ message: 'Missing brand' }, { status: 400 });

  const { data: cust } = await supabaseAdmin.from('customers').select('id').eq('name', brand).maybeSingle();
  if (!cust?.id) return NextResponse.json({ message: 'Brand not found' }, { status: 404 });

  const { data: locs } = await supabaseAdmin
    .from('locations')
    .select('id,city,latitude,longitude,name')
    .eq('customer_id', cust.id)
    .or('latitude.is.null,longitude.is.null');

  let updated = 0;
  for (const l of locs || []) {
    const q = (l.city || l.name || '').toString();
    if (!q) continue;
    try {
      await new Promise(r => setTimeout(r, 1000)); // Nominatim politeness
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', USA')}`, { headers: { 'User-Agent': 'lucere-portal/1.0' } });
      const arr = await resp.json();
      if (Array.isArray(arr) && arr[0]) {
        const lat = Number(arr[0].lat), lon = Number(arr[0].lon);
        const up = await supabaseAdmin.from('locations').update({ latitude: lat, longitude: lon }).eq('id', l.id);
        if (!(up as any).error) updated++;
      }
    } catch {}
  }

  return NextResponse.json({ updated });
}


