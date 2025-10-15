"use client";

import { useEffect, useState } from "react";

export function Greeting() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ldm_customer_name");
    if (stored) setName(stored);
  }, []);

  if (!name) return null;
  return (
    <div className="text-sm text-gray-300">
      Welcome back, <span className="font-semibold" style={{background:"linear-gradient(90deg, var(--accent), var(--accent-2))", WebkitBackgroundClip:"text", color:"transparent"}}>{name}</span>!
    </div>
  );
}


