"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, code }),
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "Invalid brand or access code");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="card w-full max-w-xl p-8 space-y-5">
        <div className="text-xl font-semibold">Sign in</div>
        <div className="text-sm text-gray-400">Enter your brand and access code.</div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Brand Name</label>
          <input
            className="w-full bg-transparent border border-white/10 rounded px-3 py-3 text-base"
            placeholder="e.g., Holla"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Access Code</label>
          <input
            className="w-full bg-transparent border border-white/10 rounded px-3 py-3 text-base"
            placeholder="Your code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        {error ? <div className="text-sm text-red-400">{error}</div> : null}
        <button type="submit" className="btn btn-accent w-full py-3 text-base" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}


