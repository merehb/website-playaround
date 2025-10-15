"use client";

import { useState } from "react";

export default function CampaignsPage() {
  const rows = [
    { name: "Betterment Q4 Retail", status: "Live", markets: "PA, NJ, NY", impressions: 128_000_000 },
    { name: "Coke Holiday", status: "Scheduled", markets: "US", impressions: 640_000_000 },
    { name: "FanDuel Metro", status: "Paused", markets: "NYC", impressions: 42_000_000 },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <button className="btn btn-accent" onClick={() => setOpen(true)}>Request New Campaign</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Markets</th>
              <th className="text-right px-4 py-2">Impressions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-white/5">
                <td className="px-4 py-2 font-medium">{r.name}</td>
                <td className="px-4 py-2">{r.status}</td>
                <td className="px-4 py-2">{r.markets}</td>
                <td className="px-4 py-2 text-right">{r.impressions.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="card w-[520px]" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-white/5 font-medium">Request New Campaign</div>
            <form className="p-4 space-y-3" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Advertiser</label>
                <input className="w-full bg-transparent border border-white/10 rounded px-3 py-2" placeholder="Brand name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Markets</label>
                  <input className="w-full bg-transparent border border-white/10 rounded px-3 py-2" placeholder="e.g., PA, NJ, NY" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Budget (USD)</label>
                  <input className="w-full bg-transparent border border-white/10 rounded px-3 py-2" placeholder="e.g., 250000" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Notes</label>
                <textarea className="w-full bg-transparent border border-white/10 rounded px-3 py-2" rows={3} placeholder="Timing, audience, placements" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


