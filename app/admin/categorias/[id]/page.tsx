import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { CategoryForm } from '../_components/CategoryForm'
import type { Brand, Category } from '@/types/database'

export const metadata: Metadata = { title: 'Editar categoría' }

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: catData }, { data: brandsData }] = await Promise.all([
    supabase.from('categories').select('*').eq('id', id).single(),
    supabase.from('brands').select('id, name').eq('is_active', true).order('name'),
  ])
  const category = catData as Category | null
  const brands = brandsData as Pick<Brand, 'id' | 'name'>[] | null

  if (!category) notFound()

  return (
    <div>
      <PageHeader
        title={`Editar: ${category.name}`}
        description="Modifica los datos de esta categoría."
      />
      <CategoryForm category={category} brands={brands ?? []} />
    </div>
  )
}
