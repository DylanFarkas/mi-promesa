import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { BrandForm } from '../_components/BrandForm'
import type { Brand } from '@/types/database'

export const metadata: Metadata = { title: 'Editar marca' }

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()
  const brand = data as Brand | null

  if (!brand) notFound()

  return (
    <div>
      <PageHeader
        title={`Editar: ${brand.name}`}
        description="Modifica los datos de esta marca."
      />
      <BrandForm brand={brand} />
    </div>
  )
}
