'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'
import type { Order, OrderStatus } from '@/types/database'

interface OrderStatusFormProps {
  order: Order
}

const statusOptions = [
  { value: 'pending_contact', label: 'Pendiente de contacto' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'cancelled', label: 'Cancelada' },
]

export function OrderStatusForm({ order }: OrderStatusFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [status, setStatus] = useState<OrderStatus>(order.status)
  const [adminNotes, setAdminNotes] = useState(order.admin_notes ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setError(null)
    setSuccess(false)
    setLoading(true)

    const { error: dbError } = await supabase
      .from('orders')
      .update({ status, admin_notes: adminNotes.trim() || null } as never)
      .eq('id', order.id)

    setLoading(false)

    if (dbError) {
      setError('Error al guardar los cambios.')
      return
    }

    setSuccess(true)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-slate-900">
          Estado y notas internas
        </h2>
      </CardHeader>
      <CardBody className="space-y-4">
        {error && <Alert variant="error" message={error} />}
        {success && <Alert variant="success" message="Cambios guardados correctamente." />}

        <Select
          id="status"
          label="Estado de la orden"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          options={statusOptions}
        />
        <Textarea
          id="admin_notes"
          label="Notas internas"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Notas visibles solo para el admin..."
          rows={4}
          hint="Solo el equipo de administración puede ver estas notas."
        />
      </CardBody>
      <CardFooter>
        <Button onClick={handleSave} loading={loading}>
          Guardar cambios
        </Button>
      </CardFooter>
    </Card>
  )
}
