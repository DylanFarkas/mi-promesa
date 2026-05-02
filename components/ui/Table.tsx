interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table
        className={['w-full border-collapse text-sm', className].join(' ')}
      >
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-slate-50 border-b border-slate-200">
      {children}
    </thead>
  )
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>
}

export function Th({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={[
        'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
        className,
      ].join(' ')}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <td className={['px-4 py-3 text-slate-700', className].join(' ')}>
      {children}
    </td>
  )
}
