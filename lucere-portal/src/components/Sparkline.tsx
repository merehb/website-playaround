"use client";

import { Sparklines, SparklinesLine } from "react-sparklines";

export function Sparkline({ values, color = "#f59e0b" }: { values: number[]; color?: string }) {
  return (
    <div className="h-14 rounded-md overflow-hidden">
      <Sparklines data={values} width={220} height={56} margin={6}>
        <SparklinesLine color={color} style={{ fill: "none", strokeWidth: 2 }} />
      </Sparklines>
    </div>
  );
}


