"use client";

import { Sparklines, SparklinesLine } from "react-sparklines";

export function Sparkline({ values, color = "#f59e0b" }: { values: number[]; color?: string }) {
  return (
    <div className="h-12 rounded-md overflow-hidden">
      <Sparklines data={values} width={160} height={48} margin={6}>
        <SparklinesLine color={color} style={{ fill: "none" }} />
      </Sparklines>
    </div>
  );
}


