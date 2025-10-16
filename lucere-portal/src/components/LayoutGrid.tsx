"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MainContainer from "@/components/MainContainer";

export default function LayoutGrid({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith("/login");
  if (isLogin) {
    return (
      <div className="min-h-screen">
        <MainContainer>{children}</MainContainer>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[240px_1fr] min-h-screen">
      <Sidebar />
      <MainContainer>{children}</MainContainer>
    </div>
  );
}


