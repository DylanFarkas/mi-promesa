interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={[
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={['px-6 py-4 border-b border-slate-200', className].join(' ')}>
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }: CardProps) {
  return (
    <div className={['px-6 py-4', className].join(' ')}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }: CardProps) {
  return (
    <div
      className={[
        'px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
