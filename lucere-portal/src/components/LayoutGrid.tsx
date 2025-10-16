"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MainContainer from "@/components/MainContainer";

export default function LayoutGrid({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith("/login");
  return (
    <div className={isLogin ? "grid grid-cols-1 grid-rows-[64px_1fr] min-h-screen" : "grid grid-cols-[240px_1fr] grid-rows-[64px_1fr] min-h-screen"}>
      <Sidebar />
      <MainContainer>{children}</MainContainer>
    </div>
  );
}


