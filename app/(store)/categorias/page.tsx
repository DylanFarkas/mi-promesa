import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Navega por nuestras categorías de productos.',
}

export const revalidate = 60

export default async function CategoriasPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .is('brand_id', null)
    .eq('is_active', true)
    .order('sort_order')

  const categoryList = categories ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-1">Navegar</p>
        <h1 className="text-3xl font-bold text-stone-900">Categorías</h1>
        <p className="mt-2 text-stone-500 text-sm max-w-xl">
          Explora nuestros productos organizados por tipo.
        </p>
      </div>

      {categoryList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <p className="text-lg font-medium">Próximamente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryList.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-stone-100 bg-white p-6 hover:border-rose-200 hover:shadow-md transition-all duration-200 min-h-[140px]"
            >
              <div>
                <h2 className="text-lg font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="mt-1.5 text-sm text-stone-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <span className="flex items-center gap-1 text-xs font-semibold text-rose-500 group-hover:gap-2 transition-all">
                  Ver productos
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
