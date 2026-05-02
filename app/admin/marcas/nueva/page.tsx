import type { Metadata } from 'next'
import { PageHeader } from '@/components/admin/PageHeader'
import { BrandForm } from '../_components/BrandForm'

export const metadata: Metadata = { title: 'Nueva marca' }

export default function NewBrandPage() {
  return (
    <div>
      <PageHeader
        title="Nueva marca"
        description="Agrega una nueva marca al catálogo."
      />
      <BrandForm />
    </div>
  )
}
