"use client";

import { useEffect, useState, useMemo } from "react";
import { KpiCard } from "@/components/KpiCard";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { FilterBar } from "@/components/FilterBar";
import { MiniBars, MiniPie, PieDatum } from "@/components/Charts";

export default function ReportingPage() {
  const [loading, setLoading] = useState(true);
  const [impressions, setImpressions] = useState(0);
  const [reach, setReach] = useState(0);
  const [visits, setVisits] = useState(0);
  const [conversions, setConversions] = useState(0);
  const [weeklySeries, setWeeklySeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [categories, setCategories] = useState<PieDatum[]>([]);
  const [range, setRange] = useState<"4w" | "12w" | "qtd" | "ytd">("4w");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/brand/overview?range=${range}`);
        if (!res.ok) return;
        const data = await res.json();
        setImpressions(Number(data.impressionsInRange || 0));
        setReach(Number(data.reachInRange || 0));
        setVisits(Number(data.visitsInRange || 0));
        setConversions(Number(data.conversionsInRange || 0));
        const ws = (data.weeklySeries || []) as { weekStart: string; value: number }[];
        setWeeklySeries(ws.map((p) => p.value));
        setLabels(ws.map((p) => new Date(p.weekStart).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))); 
        const vb = data.venueBreakdown || {};
        const colorMap: Record<string,string> = { Grocery: "#6366F1", Convenience: "#22C55E", "Beer Distributors": "#F59E0B", Casinos: "#10B981", Other: "#EF4444" };
        setCategories(Object.keys(vb).map((k) => ({ label: k, value: vb[k], color: colorMap[k] || "#8884d8" })));
      } finally {
        setLoading(false);
      }
    })();
  }, [range]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reporting & Insights</h1>
        <p className="text-sm text-gray-600">Lucere network performance (mock data)</p>
      </div>

      <FilterBar controlledRange={range} onRangeChange={(v) => setRange(v)} />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Impressions" value={<AnimatedNumber value={impressions} />} sparklineValues={weeklySeries.slice(-10)} />
        <KpiCard label="Reach" value={<AnimatedNumber value={reach} />} />
        <KpiCard label="Visits" value={<AnimatedNumber value={visits} />} />
        <KpiCard label="Conversions" value={<AnimatedNumber value={conversions} />} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="font-medium mb-3">Impressions by Venue Type</h2>
          <MiniPie data={categories.length ? categories : [{ label: "No data", value: 1, color: "#333" }]} />
        </div>
        <div className="card p-4">
          <h2 className="font-medium mb-3">Weekly Impressions (Last 12w)</h2>
          <MiniBars values={weeklySeries.length ? weeklySeries : [0,0,0,0,0,0,0,0,0,0,0,0]} labels={labels} />
        </div>
      </section>
    </div>
  );
}


