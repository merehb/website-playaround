export type PieDatum = { label: string; value: number; color: string };

export function MiniPie({ data }: { data: PieDatum[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  return (
    <svg viewBox="0 0 42 42" className="w-full max-w-xs">
      {data.map((d, i) => {
        const pct = (d.value / total) * 100;
        const dashArray = `${pct} ${100 - pct}`;
        const dashOffset = 25 - (cumulative / 100) * 100;
        cumulative += pct;
        return (
          <circle
            key={i}
            r="15.915"
            cx="21"
            cy="21"
            fill="transparent"
            stroke={d.color}
            strokeWidth="8"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
          />
        );
      })}
    </svg>
  );
}

export function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <div className="grid grid-cols-12 items-end gap-2 h-48">
      {values.map((v, i) => (
        <div key={i} className="bg-[#0EA5E9]/80 rounded-sm" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}


