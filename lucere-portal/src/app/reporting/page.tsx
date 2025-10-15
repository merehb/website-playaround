"use client";

import { useMemo } from "react";

type DataPoint = { label: string; value: number; color: string };

export default function ReportingPage() {
  const kpis = useMemo(
    () => [
      { label: "Impressions", value: 6950094114, color: "#4F46E5" },
      { label: "Reach", value: 1245000000, color: "#22C55E" },
      { label: "Visits", value: 34500000, color: "#F59E0B" },
      { label: "Conversions", value: 582000, color: "#EF4444" },
    ],
    []
  );

  const categories: DataPoint[] = useMemo(
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

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="border rounded-md p-4">
            <div className="text-xs text-gray-500">{kpi.label}</div>
            <div className="text-2xl font-bold mt-1">
              {kpi.label === "Impressions"
                ? kpi.value.toLocaleString()
                : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(kpi.value)}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border rounded-md p-4">
          <h2 className="font-medium mb-3">Impressions by Venue Type</h2>
          <PieChart data={categories} />
        </div>
        <div className="border rounded-md p-4">
          <h2 className="font-medium mb-3">Weekly Impressions (Last 12w)</h2>
          <BarChart />
        </div>
      </section>
    </div>
  );
}

function PieChart({ data }: { data: DataPoint[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;

  return (
    <svg viewBox="0 0 42 42" className="w-full max-w-xs">
      {data.map((d, i) => {
        const value = (d.value / total) * 100;
        const dashArray = `${value} ${100 - value}`;
        const dashOffset = 25 - (cumulative / 100) * 100;
        cumulative += value;
        return (
          <circle
            key={i}
            r="15.915"
            cx="21"
            cy="21"
            fill="transparent"
            stroke={d.color}
            strokeWidth="8"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
          />
        );
      })}
    </svg>
  );
}

function BarChart() {
  const values = [62, 64, 61, 66, 70, 68, 72, 74, 73, 78, 80, 83];
  const max = Math.max(...values);

  return (
    <div className="grid grid-cols-12 items-end gap-2 h-48">
      {values.map((v, i) => (
        <div key={i} className="bg-[#F59E0B]/80 rounded-sm" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}


