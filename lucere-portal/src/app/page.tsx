"use client";

import { useEffect, useState } from "react";
import { MapWidget } from "@/components/MapWidget";
import { TopLocations } from "@/components/TopLocations";
import { Greeting } from "@/components/Greeting";

export default function Home() {
  const [screens, setScreens] = useState(0);
  const [impressions, setImpressions] = useState(0);
  const [active, setActive] = useState(0);
  const [top, setTop] = useState<{ store: string; city: string; impressions: number }[]>([]);
  const [miniMapPoints, setMiniMapPoints] = useState<{ name: string; coords: [number, number]; value?: number }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [oRes, cRes] = await Promise.all([
          fetch('/api/brand/overview?range=4w'),
          fetch('/api/brand/campaigns')
        ]);
        if (oRes.ok) {
          const o = await oRes.json();
          setScreens(Number(o.screensLive || 0));
          setImpressions(Number(o.impressionsInRange || 0));
          setActive(Number(o.activeCampaigns || 0));
        }
        if (cRes.ok) {
          const d = await cRes.json();
          const rows = (d.rows || []) as any[];
          const agg = new Map<string, number>();
          const city = new Map<string, string>();
          for (const r of rows) {
            const key = r.location_name || '-';
            agg.set(key, (agg.get(key) || 0) + Number(r.impressions || 0));
            city.set(key, r.city || '-');
          }
          const list = Array.from(agg.entries())
            .map(([store, impressions]) => ({ store, city: city.get(store) || '-', impressions }))
            .sort((a,b) => b.impressions - a.impressions)
            .slice(0,3);
          setTop(list);
        }
        // fetch locations for mini map
        const lRes = await fetch('/api/brand/locations');
        if (lRes.ok) {
          const l = await lRes.json();
          const pts = (l.points || []).map((p:any) => ({ name: p.name, coords: [p.lat, p.lng] as [number, number], value: p.impressions }));
          setMiniMapPoints(pts);
        }
      } catch {}
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <Greeting />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-12 gap-4">
        <div className="card p-5 col-span-12 md:col-span-4 min-h-[120px] flex flex-col justify-between">
          <div className="text-sm text-gray-400">Screens Live</div>
          <div className="text-3xl font-bold" style={{background:"linear-gradient(90deg, var(--accent), var(--accent-2))", WebkitBackgroundClip:"text", color:"transparent"}}>{screens.toLocaleString()}</div>
        </div>
        <div className="card p-5 col-span-12 md:col-span-4 min-h-[120px] flex flex-col justify-between">
          <div className="text-sm text-gray-400">Weekly Impressions</div>
          <div className="text-3xl font-bold" style={{background:"linear-gradient(90deg, var(--accent), var(--accent-2))", WebkitBackgroundClip:"text", color:"transparent"}}>{impressions.toLocaleString()}</div>
        </div>
        <div className="card p-5 col-span-12 md:col-span-4 min-h-[120px] flex flex-col justify-between">
          <div className="text-sm text-gray-400">Active Campaigns</div>
          <div className="text-3xl font-bold" style={{background:"linear-gradient(90deg, var(--accent), var(--accent-2))", WebkitBackgroundClip:"text", color:"transparent"}}>{active.toLocaleString()}</div>
        </div>
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <div className="card p-5 h-full">
            <h2 className="font-medium mb-3">Recent Activity</h2>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>• Betterment Q4 Retail — flight extended to Nov 30</li>
              <li>• New screens added — 12 locations in Philadelphia, PA</li>
              <li>• CPM optimization enabled for 7 campaigns</li>
            </ul>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <MapWidget points={miniMapPoints} />
          <TopLocations rows={top} />
        </div>
      </div>
    </div>
  );
}
