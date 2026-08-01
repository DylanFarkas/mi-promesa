import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BrandCard } from '@/components/store/BrandCard'

export const metadata: Metadata = {
  title: 'Marcas',
  description: 'Explora las marcas que distribuimos en hogar, belleza, nutrición y más.',
}

export const revalidate = 60

export default async function MarcasPage() {
  const supabase = await createClient()

  const [{ data: brands }, { data: productRows }] = await Promise.all([
    supabase
      .from('brands')
      .select('id, name, slug, description, logo_url')
      .eq('is_active', true)
      .order('sort_order'),
    supabase.from('products').select('brand_id').eq('is_active', true),
  ])

  const brandList = brands ?? []
  const countByBrand: Record<string, number> = {}
  for (const row of productRows ?? []) {
    countByBrand[row.brand_id] = (countByBrand[row.brand_id] ?? 0) + 1
  }

  return (
    <article className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <header className="mb-12 md:mb-16">
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-primary uppercase">
          <span aria-hidden>✦</span>
          Catálogo
        </span>
        <h1 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-4xl font-bold leading-[1.02] tracking-tight text-ink md:text-5xl lg:text-6xl">
          Marcas en las que <span className="store-squiggle text-primary">confiamos</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-on-surface-variant">
          Trabajamos con marcas reconocidas y de calidad comprobada, listas para llegar a tu hogar o
          negocio.
        </p>
      </header>

      {brandList.length === 0 ? (
        <p className="py-24 text-center text-sm text-on-surface-variant">Próximamente</p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {brandList.map((brand) => (
            <li key={brand.id}>
              <BrandCard
                variant="editorial"
                brand={brand}
                productCount={countByBrand[brand.id] ?? 0}
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
