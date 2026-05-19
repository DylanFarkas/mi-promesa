import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BrandCard } from '@/components/store/BrandCard'

export const metadata: Metadata = {
  title: 'Marcas',
  description: 'Explora todas nuestras marcas de productos de belleza, bienestar y hogar.',
}

export const revalidate = 60

export default async function MarcasPage() {
  const supabase = await createClient()

  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug, description')
    .eq('is_active', true)
    .order('sort_order')

  const brandList = brands ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-1">Catálogo</p>
        <h1 className="text-3xl font-bold text-stone-900">Nuestras marcas</h1>
        <p className="mt-2 text-stone-500 text-sm max-w-xl">
          Marcas seleccionadas con los mejores estándares de calidad.
        </p>
      </div>

      {brandList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <p className="text-lg font-medium">Próximamente</p>
          <p className="text-sm mt-1">Estamos preparando nuestro catálogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brandList.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </div>
  )
}
