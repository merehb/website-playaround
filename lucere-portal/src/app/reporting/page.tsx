"use client";

import { useMemo } from "react";
import { KpiCard } from "@/components/KpiCard";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { FilterBar } from "@/components/FilterBar";
import { MiniBars, MiniPie, PieDatum } from "@/components/Charts";

export default function ReportingPage() {
  const kpis = useMemo(
    () => [
      { label: "Impressions", value: 6950094114 },
      { label: "Reach", value: 1245000000 },
      { label: "Visits", value: 34500000 },
      { label: "Conversions", value: 582000 },
    ],
    []
  );

  const categories: PieDatum[] = useMemo(
    () => [
      { label: "Grocery", value: 49.62, color: "#4F46E5" },
      { label: "Convenience", value: 32.38, color: "#22C55E" },
      { label: "Beer/Distributors", value: 8.33, color: "#F59E0B" },
      { label: "Casinos", value: 7.97, color: "#10B981" },
      { label: "Other", value: 1.70, color: "#EF4444" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reporting & Insights</h1>
        <p className="text-sm text-gray-600">Lucere network performance (mock data)</p>
      </div>

      <FilterBar />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={<AnimatedNumber value={k.value} />}
            sparklineValues={[60 + i * 2, 62, 61, 64, 65, 63, 66, 68, 67, 70]}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="font-medium mb-3">Impressions by Venue Type</h2>
          <MiniPie data={categories} />
        </div>
        <div className="card p-4">
          <h2 className="font-medium mb-3">Weekly Impressions (Last 12w)</h2>
          <MiniBars values={[62, 64, 61, 66, 70, 68, 72, 74, 73, 78, 80, 83]} />
        </div>
      </section>
    </div>
  );
}


