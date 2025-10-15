type KpiCardProps = {
  label: string;
  value: string | number | React.ReactNode;
  hint?: string;
};

export function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <span>{label}</span>
        {hint ? <span className="text-[10px] text-gray-400">{hint}</span> : null}
      </div>
      <div className="text-2xl md:text-3xl font-bold mt-1">{value}</div>
    </div>
  );
}


