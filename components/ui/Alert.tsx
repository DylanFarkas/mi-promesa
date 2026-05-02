import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant: AlertVariant
  title?: string
  message: string
  className?: string
}

const config: Record<
  AlertVariant,
  { icon: React.ElementType; containerClass: string; iconClass: string; titleClass: string; msgClass: string }
> = {
  success: {
    icon: CheckCircle2,
    containerClass: 'bg-emerald-50 border-emerald-200',
    iconClass: 'text-emerald-500',
    titleClass: 'text-emerald-800',
    msgClass: 'text-emerald-700',
  },
  error: {
    icon: XCircle,
    containerClass: 'bg-red-50 border-red-200',
    iconClass: 'text-red-500',
    titleClass: 'text-red-800',
    msgClass: 'text-red-700',
  },
  warning: {
    icon: AlertCircle,
    containerClass: 'bg-amber-50 border-amber-200',
    iconClass: 'text-amber-500',
    titleClass: 'text-amber-800',
    msgClass: 'text-amber-700',
  },
  info: {
    icon: Info,
    containerClass: 'bg-sky-50 border-sky-200',
    iconClass: 'text-sky-500',
    titleClass: 'text-sky-800',
    msgClass: 'text-sky-700',
  },
}

export function Alert({ variant, title, message, className = '' }: AlertProps) {
  const { icon: Icon, containerClass, iconClass, titleClass, msgClass } =
    config[variant]

  return (
    <div
      className={[
        'flex gap-3 rounded-lg border p-4',
        containerClass,
        className,
      ].join(' ')}
      role="alert"
    >
      <Icon className={['mt-0.5 shrink-0', iconClass].join(' ')} size={18} />
      <div>
        {title && (
          <p className={['text-sm font-semibold', titleClass].join(' ')}>
            {title}
          </p>
        )}
        <p className={['text-sm', msgClass].join(' ')}>{message}</p>
      </div>
    </div>
  )
}
