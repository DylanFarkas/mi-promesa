import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatCard } from '@/components/admin/StatCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Table, TableHead, TableBody, Th, Td } from '@/components/ui/Table'
import { Tag, Package, ShoppingBag, FolderOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Order } from '@/types/database'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: brandsCount },
    { count: categoriesCount },
    { count: productsCount },
    { count: ordersCount },
    { data: recentOrdersData },
    { count: pendingCount },
  ] = await Promise.all([
    supabase.from('brands').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('id, order_number, status, customer_name, subtotal, currency, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending_contact'),
  ])
  const recentOrders = recentOrdersData as Partial<Order>[] | null

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount)

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Resumen general de tu tienda"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Marcas"
          value={brandsCount ?? 0}
          icon={Tag}
          color="indigo"
        />
        <StatCard
          title="Categorías"
          value={categoriesCount ?? 0}
          icon={FolderOpen}
          color="emerald"
        />
        <StatCard
          title="Productos"
          value={productsCount ?? 0}
          icon={Package}
          color="amber"
        />
        <StatCard
          title="Órdenes pendientes"
          value={pendingCount ?? 0}
          icon={ShoppingBag}
          color="rose"
        />
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Órdenes recientes
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Total: {ordersCount ?? 0} órdenes
              </p>
            </div>
            <Link
              href="/admin/ordenes"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {recentOrders && recentOrders.length > 0 ? (
            <Table>
              <TableHead>
                <tr>
                  <Th>Orden</Th>
                  <Th>Cliente</Th>
                  <Th>Estado</Th>
                  <Th>Total</Th>
                  <Th>Fecha</Th>
                  <Th />
                </tr>
              </TableHead>
              <TableBody>
                {recentOrders.map((order: Partial<Order>) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <Td>
                      <span className="font-mono text-xs font-semibold text-slate-700">
                        {order.order_number}
                      </span>
                    </Td>
                    <Td>{order.customer_name}</Td>
                    <Td>
                      <StatusBadge status={order.status!} />
                    </Td>
                    <Td className="font-medium">
                      {formatCurrency(order.subtotal!, order.currency!)}
                    </Td>
                    <Td className="text-slate-500 text-xs">
                      {formatDate(order.created_at!)}
                    </Td>
                    <Td>
                      <Link
                        href={`/admin/ordenes/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-xs font-medium"
                      >
                        Ver
                      </Link>
                    </Td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500">
              No hay órdenes todavía.
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
