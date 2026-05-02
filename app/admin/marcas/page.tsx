import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { ActiveBadge } from '@/components/admin/ActiveBadge'
import { EmptyState } from '@/components/admin/EmptyState'
import { Button } from '@/components/ui/Button'
import { Table, TableHead, TableBody, Th, Td } from '@/components/ui/Table'
import { Plus, Pencil, Tag } from 'lucide-react'
import type { Brand } from '@/types/database'

export const metadata: Metadata = { title: 'Marcas' }

export default async function BrandsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('brands')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  const brands = data as Brand[] | null

  return (
    <div>
      <PageHeader
        title="Marcas"
        description="Gestiona las marcas del catálogo"
        action={
          <Link href="/admin/marcas/nueva">
            <Button size="md">
              <Plus size={16} />
              Nueva marca
            </Button>
          </Link>
        }
      />

      {brands && brands.length > 0 ? (
        <Table>
          <TableHead>
            <tr>
              <Th>Nombre</Th>
              <Th>Slug</Th>
              <Th>Orden</Th>
              <Th>Estado</Th>
              <Th />
            </tr>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-slate-50 transition-colors">
                <Td>
                  <span className="font-medium text-slate-900">{brand.name}</span>
                  {brand.description && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                      {brand.description}
                    </p>
                  )}
                </Td>
                <Td>
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                    {brand.slug}
                  </code>
                </Td>
                <Td className="text-slate-500">{brand.sort_order}</Td>
                <Td>
                  <ActiveBadge isActive={brand.is_active} />
                </Td>
                <Td>
                  <Link
                    href={`/admin/marcas/${brand.id}`}
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
          icon={Tag}
          title="Sin marcas registradas"
          description="Agrega tu primera marca para comenzar a organizar el catálogo."
          action={
            <Link href="/admin/marcas/nueva">
              <Button>
                <Plus size={16} />
                Nueva marca
              </Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
