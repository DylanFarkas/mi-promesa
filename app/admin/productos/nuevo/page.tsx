import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { ProductForm } from '../_components/ProductForm'
import type { Brand, Category } from '@/types/database'

export const metadata: Metadata = { title: 'Nuevo producto' }

export default async function NewProductPage() {
  const supabase = await createClient()

  const [{ data: brandsData }, { data: categoriesData }] = await Promise.all([
    supabase.from('brands').select('id, name').eq('is_active', true).order('name'),
    supabase
      .from('categories')
      .select('id, name, brand_id')
      .eq('is_active', true)
      .order('name'),
  ])
  const brands = brandsData as Pick<Brand, 'id' | 'name'>[] | null
  const categories = categoriesData as Pick<Category, 'id' | 'name' | 'brand_id'>[] | null

  return (
    <div>
      <PageHeader
        title="Nuevo producto"
        description="Agrega un nuevo producto al catálogo."
      />
      <ProductForm brands={brands ?? []} categories={categories ?? []} />
    </div>
  )
}
