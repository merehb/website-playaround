export default function CampaignsPage() {
  const rows = [
    { name: "Betterment Q4 Retail", status: "Live", markets: "PA, NJ, NY", impressions: 128_000_000 },
    { name: "Coke Holiday", status: "Scheduled", markets: "US", impressions: 640_000_000 },
    { name: "FanDuel Metro", status: "Paused", markets: "NYC", impressions: 42_000_000 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Campaigns</h1>
      <div className="border rounded-md overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Markets</th>
              <th className="text-left px-4 py-2">Impressions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t">
                <td className="px-4 py-2 font-medium">{r.name}</td>
                <td className="px-4 py-2">{r.status}</td>
                <td className="px-4 py-2">{r.markets}</td>
                <td className="px-4 py-2">{r.impressions.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


