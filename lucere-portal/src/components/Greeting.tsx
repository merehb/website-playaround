"use client";

import { useEffect, useState } from "react";

export function Greeting() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    // Prefer cookie set by /api/login, fallback to localStorage
    const match = document.cookie.match(/(?:^|; )ldm_customer_name=([^;]+)/);
    const fromCookie = match ? decodeURIComponent(match[1]) : null;
    const fromLocal = localStorage.getItem("ldm_customer_name");
    setName(fromCookie || fromLocal);
  }, []);

  if (!name) return null;
  return (
    <div className="text-sm text-gray-300">
      Welcome back, <span className="font-semibold" style={{background:"linear-gradient(90deg, var(--accent), var(--accent-2))", WebkitBackgroundClip:"text", color:"transparent"}}>{name}</span>!
    </div>
  );
}


