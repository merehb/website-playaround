export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-md p-4">
          <div className="text-sm text-gray-500">Screens Live</div>
          <div className="text-3xl font-bold mt-1">1,284</div>
        </div>
        <div className="border rounded-md p-4">
          <div className="text-sm text-gray-500">Weekly Impressions</div>
          <div className="text-3xl font-bold mt-1">96.2M</div>
        </div>
        <div className="border rounded-md p-4">
          <div className="text-sm text-gray-500">Active Campaigns</div>
          <div className="text-3xl font-bold mt-1">43</div>
        </div>
      </div>
      <div className="border rounded-md p-4">
        <h2 className="font-medium mb-2">Recent Activity</h2>
        <ul className="text-sm space-y-1">
          <li>• Betterment Q4 Retail — flight extended to Nov 30</li>
          <li>• New screens added — 12 locations in Philadelphia, PA</li>
          <li>• CPM optimization enabled for 7 campaigns</li>
        </ul>
      </div>
    </div>
  );
}
