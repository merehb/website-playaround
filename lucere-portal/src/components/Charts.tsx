export type PieDatum = { label: string; value: number; color: string };

export function MiniPie({ data }: { data: PieDatum[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_200px] gap-4 items-center">
      <svg viewBox="0 0 42 42" className="w-full max-w-sm">
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
        {/* donut hole */}
        <circle r="10" cx="21" cy="21" fill="#0b0b0b" />
      </svg>
      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: d.color }} />
            <span className="text-gray-300">{d.label}</span>
            <span className="ml-auto text-gray-400">{((d.value / total) * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MiniBars({ values, labels }: { values: number[]; labels?: string[] }) {
  const max = Math.max(...values);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 items-end gap-2 h-48 rounded-md overflow-hidden">
        {values.map((v, i) => (
          <div key={i} className="rounded-sm" style={{ background: "linear-gradient(180deg, var(--accent), var(--accent-2))", height: `${(v / max) * 100}%` }} />
        ))}
      </div>
      {labels && (
        <div className="grid grid-cols-12 text-[10px] text-gray-400">
          {labels.map((l, i) => (
            <div key={i} className="text-center truncate">{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}


