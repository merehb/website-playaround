"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [brand, setBrand] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [replace, setReplace] = useState(false);
  const [geoMsg, setGeoMsg] = useState<string | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (res.ok) setAuthed(true);
    else setMessage("Wrong admin password");
  }

  async function createBrand(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/brand", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand, code }) });
    const data = await res.json().catch(() => ({}));
    if (res.ok) setMessage("Brand & code created"); else setMessage(data?.message || "Error");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      {!authed ? (
        <form onSubmit={login} className="card p-4 w-full max-w-sm space-y-3">
          <div className="text-sm text-gray-400">Enter admin password</div>
          <input className="w-full bg-transparent border border-white/10 rounded px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn-accent">Sign in</button>
          {message && <div className="text-sm text-red-400">{message}</div>}
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <form onSubmit={createBrand} className="card p-4 space-y-3">
            <div className="font-medium">Create Brand + Access Code</div>
            <input className="bg-transparent border border-white/10 rounded px-3 py-2" placeholder="Brand name" value={brand} onChange={(e) => setBrand(e.target.value)} />
            <input className="bg-transparent border border-white/10 rounded px-3 py-2" placeholder="Access code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="btn btn-accent w-max">Create</button>
            {message && <div className="text-sm text-gray-300">{message}</div>}
          </form>

          <form className="card p-4 space-y-3" onSubmit={async (e) => {
            e.preventDefault();
            setUploadMsg(null);
            const form = e.currentTarget as HTMLFormElement;
            const file = (form.elements.namedItem("file") as HTMLInputElement)?.files?.[0];
            if (!file) { setUploadMsg("Please choose a CSV file"); return; }
            if (!file.name.toLowerCase().endsWith('.csv')) { setUploadMsg("File must be .csv (use 'Save As → CSV UTF-8')"); return; }
            setUploadMsg("Uploading…");
            const fd = new FormData();
            fd.set("file", file);
            if (replace) fd.set("replace", "true");
            try {
              const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
              const data = await res.json().catch(() => ({}));
              if (res.ok) { setUploadMsg(data?.mode ? `Upload successful (${data.mode})` : "Upload successful"); setFileName(""); (form.elements.namedItem("file") as HTMLInputElement).value = ""; }
              else setUploadMsg(data?.message || `Upload error (${res.status})`);
            } catch (err) {
              setUploadMsg("Network error during upload");
            }
          }}>
            <div className="font-medium">Upload CSV (campaigns.csv / locations.csv / metrics.csv)</div>
            <input id="csvFile" type="file" name="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; setFileName(f ? f.name : ""); }} />
            <div className="flex items-center gap-3">
              <label htmlFor="csvFile" className="btn btn-accent cursor-pointer">Choose CSV</label>
              <span className="text-xs text-gray-400 truncate max-w-[220px]">{fileName || "No file selected"}</span>
              <button className="btn btn-accent w-max ml-auto">Upload</button>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-400">
              <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} />
              Replace existing data for brand(s) in file
            </label>
            {uploadMsg && <div className="text-sm text-gray-300">{uploadMsg}</div>}
          </form>

          <div className="card p-4 space-y-3">
            <div className="font-medium">Backfill Geocodes</div>
            <div className="text-xs text-gray-400">Geocode existing locations for a brand (slow ~1/sec).</div>
            <div className="flex items-center gap-2">
              <input className="bg-transparent border border-white/10 rounded px-3 py-2 flex-1" placeholder="Brand name (e.g., Holla Spirits)" value={brand} onChange={(e)=>setBrand(e.target.value)} />
              <button className="btn btn-accent" onClick={async (e) => { e.preventDefault(); setGeoMsg("Running…"); const res = await fetch(`/api/admin/geocode?brand=${encodeURIComponent(brand)}`, { method: 'POST' }); const data = await res.json().catch(()=>({})); if (res.ok) setGeoMsg(`Updated ${data.updated} locations`); else setGeoMsg(data?.message || 'Error'); }}>Run</button>
            </div>
            {geoMsg && <div className="text-sm text-gray-300">{geoMsg}</div>}
          </div>
        </div>
      )}
    </div>
  );
}


