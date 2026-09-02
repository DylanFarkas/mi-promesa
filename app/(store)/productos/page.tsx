import type { Metadata } from 'next'
import { Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/store/ProductCard'
import { ProductsBrandSidebar } from '@/components/store/products/ProductsBrandSidebar'
import { StoreEmptyState } from '@/components/store/StoreEmptyState'

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explora todo nuestro catálogo de productos para hogar, belleza, nutrición y más.',
}

export const revalidate = 60

interface Props {
  searchParams: Promise<{ marca?: string }>
}

export default async function ProductosPage({ searchParams }: Props) {
  const { marca } = await searchParams
  const supabase = await createClient()

  const [{ data: brands }, { data: productRows }] = await Promise.all([
    supabase
      .from('brands')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('sort_order'),
    supabase.from('products').select('brand_id').eq('is_active', true),
  ])

  const brandList = brands ?? []
  const countByBrand: Record<string, number> = {}
  for (const row of productRows ?? []) {
    countByBrand[row.brand_id] = (countByBrand[row.brand_id] ?? 0) + 1
  }

  const brandsWithCounts = brandList
    .map((brand) => ({
      ...brand,
      count: countByBrand[brand.id] ?? 0,
    }))
    .filter((brand) => brand.count > 0)

  const totalProductCount = productRows?.length ?? 0

  let productQuery = supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, primary_image_url, short_description, brand:brands!inner(name, slug), category:categories!category_id(name, slug)',
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (marca) {
    const brandMatch = brandList.find((b) => b.slug === marca)
    if (brandMatch) productQuery = productQuery.eq('brand_id', brandMatch.id)
  }

  const { data: products } = await productQuery
  const productList = products ?? []
  const activeBrandName = marca ? brandList.find((b) => b.slug === marca)?.name : null

  return (
    <article className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <header className="mb-12 grid grid-cols-1 items-end gap-8 lg:mb-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-primary uppercase">
            <span aria-hidden>✦</span>
            Catálogo
          </span>
          <h1 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-4xl font-bold leading-[1.02] tracking-tight text-ink md:text-5xl lg:text-6xl">
            Todos los <span className="store-squiggle text-primary">productos</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-on-surface-variant md:text-lg">
            Catálogo completo con los mejores estándares de calidad. Encuentra lo que necesitas en un
            solo lugar.
          </p>
        </div>
        <aside className="flex flex-wrap gap-3 lg:justify-end">
          <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card">
            {totalProductCount}{' '}
            {totalProductCount === 1 ? 'producto en catálogo' : 'productos en catálogo'}
          </p>
          {brandsWithCounts.length > 0 && (
            <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant shadow-card">
              {brandsWithCounts.length}{' '}
              {brandsWithCounts.length === 1 ? 'marca disponible' : 'marcas disponibles'}
            </p>
          )}
        </aside>
      </header>

      {totalProductCount === 0 ? (
        <StoreEmptyState
          icon={Package}
          title="Catálogo en camino"
          description="Pronto encontrarás aquí todos nuestros productos."
          href="/marcas"
          label="Ver marcas"
          tone="sand"
          className="py-16"
        />
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <ProductsBrandSidebar
            brands={brandsWithCounts}
            totalCount={totalProductCount}
            activeBrand={marca ?? null}
          />

          <section className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-on-surface-variant">
                {productList.length} {productList.length === 1 ? 'resultado' : 'resultados'}
                {activeBrandName ? (
                  <span className="font-medium text-ink"> · {activeBrandName}</span>
                ) : null}
              </p>
            </div>

            {productList.length === 0 ? (
              <StoreEmptyState
                icon={Package}
                title="Sin productos para esta marca"
                description="Prueba con otra marca o explora todo el catálogo."
                href="/productos"
                label="Ver todos"
                tone="primary"
                className="py-8"
              />
            ) : (
              <ul className="grid list-none grid-cols-2 gap-4 p-0 sm:gap-5 md:grid-cols-3 md:gap-6">
                {productList.map((product) => (
                  <li key={product.id}>
                    <ProductCard
                      variant="editorial"
                      product={{
                        ...product,
                        brand: product.brand as unknown as { name: string; slug: string },
                        category: product.category as unknown as {
                          name: string
                          slug: string
                        } | null,
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </article>
  )
}
