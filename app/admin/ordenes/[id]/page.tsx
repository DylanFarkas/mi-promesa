import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { OrderStatusForm } from './_components/OrderStatusForm'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableHead, TableBody, Th, Td } from '@/components/ui/Table'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { ArrowLeft, User, Phone, Mail, MapPin, MessageSquare } from 'lucide-react'
import type { Order, OrderItem } from '@/types/database'

export const metadata: Metadata = { title: 'Detalle de orden' }

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()
  const order = data as (Order & { order_items: OrderItem[] }) | null

  if (!order) notFound()

  const items = (order.order_items ?? []) as OrderItem[]

  const whatsappMsg = encodeURIComponent(
    `Hola ${order.customer_name}, soy del equipo de Mi Promesa. Te contactamos respecto a tu orden ${order.order_number}. ¿Cómo podemos ayudarte?`,
  )
  const whatsappUrl = `https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${whatsappMsg}`

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/ordenes">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <PageHeader
            title={`Orden ${order.order_number}`}
            description={`Creada el ${formatDateTime(order.created_at)}`}
          />
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-slate-900">
                Productos ({items.length})
              </h2>
            </CardHeader>
            <CardBody className="p-0">
              <Table>
                <TableHead>
                  <tr>
                    <Th>Producto</Th>
                    <Th>Marca</Th>
                    <Th>Precio unit.</Th>
                    <Th>Cantidad</Th>
                    <Th>Total línea</Th>
                  </tr>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <Td>
                        <p className="font-medium text-slate-900">
                          {item.product_name}
                        </p>
                        {item.category_name && (
                          <p className="text-xs text-slate-500">
                            {item.category_name}
                          </p>
                        )}
                      </Td>
                      <Td className="text-slate-600">
                        {item.brand_name ?? '—'}
                      </Td>
                      <Td>
                        <div>
                          <p className="font-medium">
                            {formatCurrency(item.unit_price, order.currency)}
                          </p>
                          {item.list_unit_price && (
                            <p className="text-xs text-slate-400 line-through">
                              {formatCurrency(item.list_unit_price, order.currency)}
                            </p>
                          )}
                        </div>
                      </Td>
                      <Td className="text-center">{item.quantity}</Td>
                      <Td className="font-semibold">
                        {formatCurrency(item.line_total, order.currency)}
                      </Td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end px-4 py-3 border-t border-slate-100">
                <div className="text-right">
                  <span className="text-sm text-slate-500 mr-4">Subtotal</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(order.subtotal, order.currency)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Customer notes */}
          {order.customer_notes && (
            <Card>
              <CardHeader>
                <h2 className="text-sm font-semibold text-slate-900">
                  Notas del cliente
                </h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {order.customer_notes}
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Customer info */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-slate-900">
                Información del cliente
              </h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 shrink-0 text-slate-400" size={16} />
                <div>
                  <p className="text-xs text-slate-500">Nombre</p>
                  <p className="text-sm font-medium text-slate-900">
                    {order.customer_name}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 shrink-0 text-slate-400" size={16} />
                <div>
                  <p className="text-xs text-slate-500">Correo</p>
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    {order.customer_email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 shrink-0 text-slate-400" size={16} />
                <div>
                  <p className="text-xs text-slate-500">Teléfono / WhatsApp</p>
                  <p className="text-sm font-medium text-slate-900">
                    {order.customer_phone}
                  </p>
                </div>
              </div>
              {order.shipping_address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 shrink-0 text-slate-400" size={16} />
                  <div>
                    <p className="text-xs text-slate-500">Dirección</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
              >
                <MessageSquare size={16} />
                Contactar por WhatsApp
              </a>
            </CardBody>
          </Card>

          {/* Status form */}
          <OrderStatusForm order={order} />
        </div>
      </div>
    </div>
  )
}
