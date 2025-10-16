"use client";

import { usePathname } from "next/navigation";

export default function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith('/login');
  return (
    <main className={"p-6 " + (isLogin ? "flex items-center justify-center" : "") }>
      <div className={isLogin ? "w-full max-w-lg" : "grid gap-6"}>{children}</div>
    </main>
  );
}


