import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/store/ProductCard'
import { ProductsBrandSidebar } from '@/components/store/products/ProductsBrandSidebar'

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explora todo nuestro catálogo de productos de belleza, bienestar y hogar.',
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
    <article className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-12">
      <header className="mb-12 grid grid-cols-1 items-end gap-10 border-b border-zinc-100 pb-12 lg:mb-16 lg:grid-cols-2 lg:gap-16 lg:pb-16">
        <div>
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Catálogo
          </span>
          <h1 className="font-serif text-3xl leading-tight text-on-surface md:text-4xl lg:text-5xl">
            Todos los productos
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant">
            Nuestro catálogo completo, curado con los mejores estándares de calidad para tu bienestar
            y el de tu hogar.
          </p>
        </div>
        <aside className="flex flex-col items-start gap-2 lg:items-end">
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            {totalProductCount}{' '}
            {totalProductCount === 1 ? 'producto en catálogo' : 'productos en catálogo'}
          </p>
          {brandsWithCounts.length > 0 && (
            <p className="text-[10px] uppercase tracking-widest text-zinc-400">
              {brandsWithCounts.length}{' '}
              {brandsWithCounts.length === 1 ? 'marca disponible' : 'marcas disponibles'}
            </p>
          )}
        </aside>
      </header>

      {totalProductCount === 0 ? (
        <p className="py-24 text-center text-sm text-zinc-400">Próximamente</p>
      ) : (
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <ProductsBrandSidebar
            brands={brandsWithCounts}
            totalCount={totalProductCount}
            activeBrand={marca ?? null}
          />

          <section className="min-w-0 flex-1">
            <div className="mb-8 flex flex-col gap-2 border-b border-zinc-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-on-surface-variant">
                {productList.length}{' '}
                {productList.length === 1 ? 'resultado' : 'resultados'}
                {activeBrandName ? (
                  <span className="text-on-surface"> · {activeBrandName}</span>
                ) : null}
              </p>
            </div>

            {productList.length === 0 ? (
              <p className="py-20 text-center text-sm text-zinc-400">
                Sin productos para esta marca.{' '}
                <Link href="/productos" className="underline hover:text-on-surface">
                  Ver todos
                </Link>
              </p>
            ) : (
              <ul className="grid list-none grid-cols-2 gap-x-6 gap-y-12 p-0 md:grid-cols-3 md:gap-x-6">
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
