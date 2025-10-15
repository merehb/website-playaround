type KpiCardProps = {
  label: string;
  value: string | number | React.ReactNode;
  hint?: string;
};

export function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <div className="card p-4">
      <div className="text-xs text-gray-400 flex items-center gap-2">
        <span>{label}</span>
        {hint ? <span className="text-[10px] text-gray-400">{hint}</span> : null}
      </div>
      <div className="text-2xl md:text-3xl font-bold mt-1" style={{background:"linear-gradient(90deg, var(--accent), var(--accent-2))", WebkitBackgroundClip:"text", color:"transparent"}}>{value}</div>
    </div>
  );
}


