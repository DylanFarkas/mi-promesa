import { Badge } from '@/components/ui/Badge'
import type { OrderStatus } from '@/types/database'

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: 'warning' | 'success' | 'danger' }
> = {
  pending_contact: { label: 'Pendiente', variant: 'warning' },
  confirmed: { label: 'Confirmada', variant: 'success' },
  cancelled: { label: 'Cancelada', variant: 'danger' },
}

interface StatusBadgeProps {
  status: OrderStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, variant } = statusConfig[status]
  return <Badge variant={variant}>{label}</Badge>
}
