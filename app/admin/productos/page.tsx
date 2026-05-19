import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { ActiveBadge } from '@/components/admin/ActiveBadge'
import { EmptyState } from '@/components/admin/EmptyState'
import { Button } from '@/components/ui/Button'
import { Table, TableHead, TableBody, Th, Td } from '@/components/ui/Table'
import { Plus, Pencil, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import type { ProductWithRelations } from '@/types/database'

export const metadata: Metadata = { title: 'Productos' }

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, brand:brands!brand_id(id, name), category:categories!category_id(id, name)')
    .order('created_at', { ascending: false })
  const products = data as ProductWithRelations[] | null

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Gestiona el catálogo de productos"
        action={
          <Link href="/admin/productos/nuevo">
            <Button>
              <Plus size={16} />
              Nuevo producto
            </Button>
          </Link>
        }
      />

      {products && products.length > 0 ? (
        <Table>
          <TableHead>
            <tr>
              <Th>Producto</Th>
              <Th>Marca</Th>
              <Th>Categoría</Th>
              <Th>Precio</Th>
              <Th>Estado</Th>
              <Th />
            </tr>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <Td>
                  <div className="flex items-center gap-3">
                    {product.primary_image_url ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                        <Image
                          src={product.primary_image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <Package className="text-slate-400" size={18} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{product.name}</p>
                      {product.sku && (
                        <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                      )}
                    </div>
                  </div>
                </Td>
                <Td className="text-slate-600">
                  {(product.brand as { name: string } | null)?.name}
                </Td>
                <Td className="text-slate-600">
                  {(product.category as { name: string } | null)?.name}
                </Td>
                <Td>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(product.price)}
                    </p>
                    {product.compare_at_price && (
                      <p className="text-xs text-slate-400 line-through">
                        {formatCurrency(product.compare_at_price)}
                      </p>
                    )}
                  </div>
                </Td>
                <Td>
                  <ActiveBadge isActive={product.is_active} />
                </Td>
                <Td>
                  <Link
                    href={`/admin/productos/${product.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    <Pencil size={14} />
                    Editar
                  </Link>
                </Td>
              </tr>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={Package}
          title="Sin productos registrados"
          description="Agrega tu primer producto para comenzar a vender."
          action={
            <Link href="/admin/productos/nuevo">
              <Button>
                <Plus size={16} />
                Nuevo producto
              </Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
