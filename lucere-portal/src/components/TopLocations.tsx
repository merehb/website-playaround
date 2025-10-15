type Row = {
  store: string;
  city: string;
  impressions: number;
};

export function TopLocations({ rows }: { rows: Row[] }) {
  return (
    <div className="card">
      <div className="px-4 pt-3 text-sm text-gray-400">Top Performing Locations</div>
      <div className="p-4">
        <table className="w-full text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="text-left font-normal">Store</th>
              <th className="text-left font-normal">City</th>
              <th className="text-right font-normal">Impressions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.store} className="border-t border-white/5">
                <td className="py-2">{r.store}</td>
                <td>{r.city}</td>
                <td className="text-right">{r.impressions.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


