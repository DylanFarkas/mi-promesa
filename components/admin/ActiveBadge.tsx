import { Badge } from '@/components/ui/Badge'

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? 'success' : 'neutral'}>
      {isActive ? 'Activo' : 'Inactivo'}
    </Badge>
  )
}
