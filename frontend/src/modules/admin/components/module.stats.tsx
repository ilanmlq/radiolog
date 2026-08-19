
interface Stat {
  label: string;
  value: number;
}

export function ModuleStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat: Stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-card p-4"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}