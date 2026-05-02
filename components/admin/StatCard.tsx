import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  color?: 'indigo' | 'emerald' | 'amber' | 'rose'
}

const colorClasses: Record<
  NonNullable<StatCardProps['color']>,
  { bg: string; icon: string }
> = {
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600' },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = 'indigo',
}: StatCardProps) {
  const colors = colorClasses[color]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p
              className={[
                'mt-1 text-xs font-medium',
                trendUp ? 'text-emerald-600' : 'text-red-600',
              ].join(' ')}
            >
              {trend}
            </p>
          )}
        </div>
        <div className={['rounded-xl p-3', colors.bg].join(' ')}>
          <Icon className={colors.icon} size={22} />
        </div>
      </div>
    </div>
  )
}
