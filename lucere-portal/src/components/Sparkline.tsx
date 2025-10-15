"use client";

import { Sparklines, SparklinesLine } from "react-sparklines";

export function Sparkline({ values, color = "#f59e0b" }: { values: number[]; color?: string }) {
  return (
    <div className="h-10">
      <Sparklines data={values} width={120} height={40} margin={4}>
        <SparklinesLine color={color} style={{ fill: "none" }} />
      </Sparklines>
    </div>
  );
}


