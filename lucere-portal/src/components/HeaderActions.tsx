"use client";

import { usePathname } from "next/navigation";

export default function HeaderActions() {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith("/login");

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}
    window.location.href = "http://localhost:3002/login";
  };

  return (
    <nav className="text-sm flex items-center gap-4">
      <a href="https://github.com/merehb/website-playaround" className="hover:underline" target="_blank" rel="noreferrer">GitHub</a>
      {!isLogin && (
        <button className="btn btn-accent" onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}


