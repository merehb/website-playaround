"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [brand, setBrand] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

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

          <form className="card p-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); const form = e.currentTarget as HTMLFormElement; const file = (form.elements.namedItem("file") as HTMLInputElement)?.files?.[0]; if (!file) return; const text = await file.text(); const res = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": "text/csv" }, body: text }); if (res.ok) setMessage("Uploaded"); else setMessage("Upload error"); }}>
            <div className="font-medium">Upload CSV (campaigns.csv / locations.csv / metrics.csv)</div>
            <input type="file" name="file" accept=".csv" className="text-sm" />
            <button className="btn btn-accent w-max">Upload</button>
          </form>
        </div>
      )}
    </div>
  );
}


