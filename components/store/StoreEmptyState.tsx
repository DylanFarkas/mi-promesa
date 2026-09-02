import { ArrowUpRight, type LucideIcon } from 'lucide-react'
import { StoreSticker } from '@/components/store/StoreSticker'

type StoreEmptyStateProps = {
  title: string
  description?: string
  href: string
  label: string
  icon?: LucideIcon
  /** Variante de color: sand (default), primary o secondary */
  tone?: 'sand' | 'primary' | 'secondary'
  className?: string
  onNavigate?: () => void
}

const TONES = {
  sand: {
    back: 'bg-primary',
    face: 'bg-sand text-ink',
    iconWell: 'bg-ink text-secondary',
    meta: 'text-ink/55',
    link: 'text-primary hover:text-primary-deep',
  },
  primary: {
    back: 'bg-secondary',
    face: 'bg-primary text-white',
    iconWell: 'bg-secondary text-ink',
    meta: 'text-white/65',
    link: 'text-secondary hover:text-white',
  },
  secondary: {
    back: 'bg-ink',
    face: 'bg-secondary text-ink',
    iconWell: 'bg-ink text-secondary',
    meta: 'text-ink/60',
    link: 'text-ink/80 hover:text-ink',
  },
} as const

/**
 * Un solo sticker CTA para empty states — nunca un grid.
 */
export function StoreEmptyState({
  title,
  description,
  href,
  label,
  icon: Icon,
  tone = 'sand',
  className = '',
  onNavigate,
}: StoreEmptyStateProps) {
  const t = TONES[tone]

  return (
    // pr/pb: reserva el offset del sticker para que no lo recorte overflow del padre
    <div
      className={`mx-auto flex w-full max-w-sm justify-center pr-3.5 pb-3.5 ${className || 'py-10'}`.trim()}
    >
      <StoreSticker
        size="sm"
        shape="soft"
        back={t.back}
        face={t.face}
        href={href}
        onClick={onNavigate}
        className="w-full"
        faceClassName="min-h-[200px] p-6 md:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          {Icon ? (
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[-8deg] ${t.iconWell}`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
          ) : (
            <span aria-hidden />
          )}
        </div>

        <div className="mt-auto space-y-2 pt-10">
          <h3 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-xl leading-tight font-bold tracking-tight md:text-2xl">
            {title}
          </h3>
          {description ? (
            <p className={`text-sm leading-relaxed ${t.meta}`}>{description}</p>
          ) : null}
          <span
            className={`inline-flex items-center gap-1.5 pt-2 text-sm font-bold transition-colors ${t.link}`}
          >
            {label}
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        </div>
      </StoreSticker>
    </div>
  )
}
