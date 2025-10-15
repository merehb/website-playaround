import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type WeeklyPoint = { weekStart: string; value: number };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rangeParam = (url.searchParams.get("range") || "4w").toLowerCase();
  const cookie = req.headers.get("cookie") || "";
  const brand = decodeURIComponent((cookie.match(/(?:^|; )ldm_customer_name=([^;]+)/)?.[1] || "")).trim();
  if (!brand) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return d; };

  // Resolve customer
  const { data: customer } = await supabaseAdmin.from("customers").select("id").eq("name", brand).maybeSingle();
  if (!customer?.id) return NextResponse.json({ message: "Brand not found" }, { status: 404 });
  const customerId = customer.id as string;

  // Screens
  const { data: locCount } = await supabaseAdmin.from("locations").select("id", { count: "exact", head: true }).eq("customer_id", customerId);
  const screensLive = (locCount as any)?.length === 0 ? 0 : (locCount as any) === null ? 0 : (locCount as any);

  // Active campaigns (today)
  const { count: activeCampaigns = 0 } = await supabaseAdmin
    .from("campaigns")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", customerId)
    .lte("start_date", fmt(today))
    .gte("end_date", fmt(today));

  // Campaign ids
  const { data: campaigns } = await supabaseAdmin.from("campaigns").select("id").eq("customer_id", customerId);
  const campaignIds = (campaigns || []).map((c: any) => c.id);

  // Determine start date for range
  const startForRange = () => {
    if (rangeParam === "12w") return daysAgo(83);
    if (rangeParam === "qtd") {
      const d = new Date(today);
      const q = Math.floor(d.getMonth() / 3);
      const startMonth = q * 3; const s = new Date(d.getFullYear(), startMonth, 1); return s;
    }
    if (rangeParam === "ytd") return new Date(today.getFullYear(), 0, 1);
    return daysAgo(27); // 4w default
  };

  let impressionsInRange = 0;
  let reachInRange = 0;
  let visitsInRange = 0;
  let conversionsInRange = 0;
  let weeklySeries: WeeklyPoint[] = [];
  let venueBreakdown: Record<string, number> = {};

  if (campaignIds.length) {
    // Metrics last 84 days
    const start84 = fmt(daysAgo(83));
    let { data: metrics, error } = await supabaseAdmin
      .from("metrics")
      .select("impressions,reach,visits,conversions,date,location_id,campaign_id")
      .in("campaign_id", campaignIds)
      .gte("date", start84);
    if (error) {
      // Fallback for schemas that don't yet have reach/visits/conversions
      const alt = await supabaseAdmin
        .from("metrics")
        .select("impressions,date,location_id,campaign_id")
        .in("campaign_id", campaignIds)
        .gte("date", start84);
      metrics = alt.data || [];
    }

    const startRange = startForRange(); startRange.setHours(0,0,0,0);
    for (const m of metrics || []) {
      const d = new Date(m.date);
      if (d >= startRange) {
        impressionsInRange += Number((m as any).impressions || 0);
        reachInRange += Number((m as any).reach || 0);
        visitsInRange += Number((m as any).visits || 0);
        conversionsInRange += Number((m as any).conversions || 0);
      }
    }

    // Weekly buckets (12 weeks)
    const weekStart = (d: Date) => { const x = new Date(d); const day = x.getDay(); const diff = (day + 6) % 7; x.setDate(x.getDate() - diff); x.setHours(0,0,0,0); return x; };
    const bucketMap = new Map<string, number>();
    for (const m of metrics || []) {
      const ws = fmt(weekStart(new Date(m.date)));
      bucketMap.set(ws, (bucketMap.get(ws) || 0) + Number(m.impressions || 0));
    }
    // Collect last 12 weeks
    const series: WeeklyPoint[] = [];
    let start = weekStart(daysAgo(83));
    for (let i=0;i<12;i++) {
      const key = fmt(start);
      series.push({ weekStart: key, value: bucketMap.get(key) || 0 });
      start.setDate(start.getDate()+7);
    }
    weeklySeries = series;

    // Venue breakdown last 30 days
    const { data: locations } = await supabaseAdmin.from("locations").select("id,type").eq("customer_id", customerId);
    const locType = new Map<string, string>();
    for (const l of locations || []) locType.set(l.id, l.type || "Other");
    const start30 = fmt(daysAgo(29));
    const { data: recent } = await supabaseAdmin
      .from("metrics")
      .select("impressions,location_id,campaign_id,date")
      .in("campaign_id", campaignIds)
      .gte("date", start30);
    for (const r of recent || []) {
      const label = locType.get(r.location_id) || "Other";
      venueBreakdown[label] = (venueBreakdown[label] || 0) + Number(r.impressions || 0);
    }
  }

  return NextResponse.json({
    screensLive,
    activeCampaigns,
    impressionsInRange,
    reachInRange,
    visitsInRange,
    conversionsInRange,
    weeklySeries,
    venueBreakdown,
    range: rangeParam,
  });
}


