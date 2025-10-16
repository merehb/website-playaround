"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block px-3 py-2 rounded-xl hover:bg-white/5 transition-colors">{label}</Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith('/login');
  if (isLogin) return null;
  return (
    <aside className="glass p-4 space-y-1 col-start-1">
      <div className="text-xs font-semibold text-gray-400 px-2 py-1">Menu</div>
      <NavLink href="/" label="Overview" />
      <NavLink href="/reporting" label="Reporting & Insights" />
      <NavLink href="/campaigns" label="Campaigns" />
      <NavLink href="/map" label="Network Map" />
    </aside>
  );
}


