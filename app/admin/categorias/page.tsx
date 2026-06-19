import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { ActiveBadge } from '@/components/admin/ActiveBadge'
import { EmptyState } from '@/components/admin/EmptyState'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, TableHead, TableBody, Th, Td } from '@/components/ui/Table'
import { Plus, Pencil, FolderOpen } from 'lucide-react'
import type { CategoryWithBrand } from '@/types/database'

export const metadata: Metadata = { title: 'Categorías' }

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*, brand:brands(id, name)')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  const categories = data as CategoryWithBrand[] | null

  return (
    <div>
      <PageHeader
        title="Categorías"
        description="Gestiona las categorías globales y por marca"
        action={
          <Link href="/admin/categorias/nueva">
            <Button>
              <Plus size={16} />
              Nueva categoría
            </Button>
          </Link>
        }
      />

      {categories && categories.length > 0 ? (
        <Table>
          <TableHead>
            <tr>
              <Th>Imagen</Th>
              <Th>Nombre</Th>
              <Th>Tipo</Th>
              <Th>Marca</Th>
              <Th>Slug</Th>
              <Th>Estado</Th>
              <Th />
            </tr>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                <Td>
                  {cat.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.image_url}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                    />
                  ) : (
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                      —
                    </span>
                  )}
                </Td>
                <Td>
                  <span className="font-medium text-slate-900">{cat.name}</span>
                  {cat.description && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                      {cat.description}
                    </p>
                  )}
                </Td>
                <Td>
                  <Badge variant={cat.brand_id ? 'info' : 'default'}>
                    {cat.brand_id ? 'Por marca' : 'Global'}
                  </Badge>
                </Td>
                <Td className="text-slate-600">
                  {(cat.brand as { name: string } | null)?.name ?? (
                    <span className="text-slate-400 italic">—</span>
                  )}
                </Td>
                <Td>
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                    {cat.slug}
                  </code>
                </Td>
                <Td>
                  <ActiveBadge isActive={cat.is_active} />
                </Td>
                <Td>
                  <Link
                    href={`/admin/categorias/${cat.id}`}
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
          icon={FolderOpen}
          title="Sin categorías registradas"
          description="Crea categorías globales o por marca para organizar los productos."
          action={
            <Link href="/admin/categorias/nueva">
              <Button>
                <Plus size={16} />
                Nueva categoría
              </Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
