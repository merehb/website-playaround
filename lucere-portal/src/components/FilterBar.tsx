"use client";

import { useState } from "react";

type Props = {
  onApply?: (filters: { market: string; dateRange: string }) => void;
};

export function FilterBar({ onApply }: Props) {
  const [market, setMarket] = useState("United States");
  const [dateRange, setDateRange] = useState("Last 4 weeks");

  return (
    <div className="glass rounded-xl p-3 flex flex-col md:flex-row gap-3 items-start md:items-center">
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 w-16">Market</label>
        <select className="bg-transparent border border-white/10 rounded p-1 text-sm" value={market} onChange={(e) => setMarket(e.target.value)}>
          <option>United States</option>
          <option>Philadelphia, PA</option>
          <option>New York, NY</option>
          <option>Los Angeles, CA</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 w-16">Dates</label>
        <select className="bg-transparent border border-white/10 rounded p-1 text-sm" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          <option>Last 4 weeks</option>
          <option>Last 12 weeks</option>
          <option>QTD</option>
          <option>YTD</option>
        </select>
      </div>
      <div className="md:ml-auto flex gap-2">
        <button
          className="text-sm px-3 py-1.5 btn btn-accent"
          onClick={() => onApply?.({ market, dateRange })}
        >
          Apply
        </button>
        <button
          className="text-sm px-3 py-1.5 btn hover:bg-white/5"
          onClick={() => {
            setMarket("United States");
            setDateRange("Last 4 weeks");
            onApply?.({ market: "United States", dateRange: "Last 4 weeks" });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}


