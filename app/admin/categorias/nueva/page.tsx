import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { CategoryForm } from '../_components/CategoryForm'
import type { Brand } from '@/types/database'

export const metadata: Metadata = { title: 'Nueva categoría' }

export default async function NewCategoryPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('brands')
    .select('id, name')
    .eq('is_active', true)
    .order('name')
  const brands = data as Pick<Brand, 'id' | 'name'>[] | null

  return (
    <div>
      <PageHeader
        title="Nueva categoría"
        description="Crea una categoría global o asociada a una marca."
      />
      <CategoryForm brands={brands ?? []} />
    </div>
  )
}
