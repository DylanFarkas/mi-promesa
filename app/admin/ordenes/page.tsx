import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { EmptyState } from '@/components/admin/EmptyState'
import { Table, TableHead, TableBody, Th, Td } from '@/components/ui/Table'
import { ShoppingBag, Eye } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { Order } from '@/types/database'

export const metadata: Metadata = { title: 'Órdenes' }

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  const orders = data as Order[] | null

  return (
    <div>
      <PageHeader
        title="Órdenes"
        description="Gestiona y da seguimiento a los pedidos"
      />

      {orders && orders.length > 0 ? (
        <Table>
          <TableHead>
            <tr>
              <Th>Orden</Th>
              <Th>Cliente</Th>
              <Th>Contacto</Th>
              <Th>Total</Th>
              <Th>Estado</Th>
              <Th>Fecha</Th>
              <Th />
            </tr>
          </TableHead>
          <TableBody>
            {(orders as Order[]).map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <Td>
                  <span className="font-mono text-xs font-semibold text-slate-700">
                    {order.order_number}
                  </span>
                </Td>
                <Td>
                  <p className="font-medium text-slate-900">{order.customer_name}</p>
                  <p className="text-xs text-slate-500">{order.customer_email}</p>
                </Td>
                <Td className="text-sm text-slate-600">{order.customer_phone}</Td>
                <Td className="font-semibold">
                  {formatCurrency(order.subtotal, order.currency)}
                </Td>
                <Td>
                  <StatusBadge status={order.status} />
                </Td>
                <Td className="text-xs text-slate-500">
                  {formatDateTime(order.created_at)}
                </Td>
                <Td>
                  <Link
                    href={`/admin/ordenes/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    <Eye size={14} />
                    Ver
                  </Link>
                </Td>
              </tr>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="Sin órdenes todavía"
          description="Las órdenes aparecerán aquí cuando los clientes completen el checkout."
        />
      )}
    </div>
  )
}
