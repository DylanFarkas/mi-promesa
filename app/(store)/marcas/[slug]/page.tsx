import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  fetchProductIdsWithAdditionalCategory,
  productsInCategoryOrFilter,
} from '@/lib/supabase/productCategories'
import { getBrandCategoryCounts } from '@/lib/store/brand-category-counts'
import { BrandCategorySidebar } from '@/components/store/brands/BrandCategorySidebar'
import { ProductCard } from '@/components/store/ProductCard'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ categoria?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: brand } = await supabase
    .from('brands')
    .select('name, description')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!brand) return { title: 'Marca no encontrada' }

  return {
    title: brand.name,
    description: brand.description ?? `Productos de ${brand.name}`,
  }
}

export const revalidate = 60

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { categoria } = await searchParams
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('id, name, slug, description, logo_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!brand) notFound()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .order('sort_order')

  const categoryList = categories ?? []
  const { total: totalProductCount, categories: categoriesWithCounts } =
    await getBrandCategoryCounts(supabase, brand.id, categoryList)

  let productQuery = supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, primary_image_url, short_description, category_id, brand:brands!inner(name, slug), category:categories!category_id(name, slug)',
    )
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (categoria) {
    const cat = categoryList.find((c) => c.slug === categoria)
    if (cat) {
      const additionalProductIds = await fetchProductIdsWithAdditionalCategory(supabase, cat.id)
      const catFilter = productsInCategoryOrFilter(cat.id, additionalProductIds)
      productQuery =
        catFilter.mode === 'primary_only'
          ? productQuery.eq('category_id', catFilter.categoryId)
          : productQuery.or(catFilter.or)
    }
  }

  const { data: products } = await productQuery
  const productList = products ?? []
  const activeCategoryName = categoria
    ? categoryList.find((c) => c.slug === categoria)?.name
    : null

  return (
    <article className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
      <nav
        aria-label="Ruta de navegación"
        className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-on-surface-variant"
      >
        <Link href="/" className="transition-colors hover:text-primary">
          Inicio
        </Link>
        <ChevronRight size={14} className="shrink-0 opacity-50" aria-hidden />
        <Link href="/marcas" className="transition-colors hover:text-primary">
          Marcas
        </Link>
        <ChevronRight size={14} className="shrink-0 opacity-50" aria-hidden />
        <span className="font-semibold text-ink">{brand.name}</span>
      </nav>

      <header className="mb-12 grid grid-cols-1 items-end gap-8 lg:mb-16 lg:grid-cols-2 lg:gap-16">
        <div>
          {brand.logo_url && (
            <div className="mb-6 flex h-16 w-fit items-center rounded-2xl bg-white px-5 py-2 shadow-card">
              <Image
                src={brand.logo_url}
                alt={`Logo de ${brand.name}`}
                width={160}
                height={64}
                className="max-h-12 w-auto object-contain"
              />
            </div>
          )}
          <h1 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-4xl font-bold leading-[1.02] tracking-tight text-ink md:text-5xl lg:text-6xl">
            {brand.name}
          </h1>
          {brand.description && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-on-surface-variant md:text-lg">
              {brand.description}
            </p>
          )}
        </div>
        <aside className="flex flex-wrap gap-3 lg:justify-end">
          <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card">
            {totalProductCount}{' '}
            {totalProductCount === 1 ? 'producto en catálogo' : 'productos en catálogo'}
          </p>
          {categoryList.length > 0 && (
            <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant shadow-card">
              {categoryList.length} {categoryList.length === 1 ? 'categoría' : 'categorías'}
            </p>
          )}
        </aside>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <BrandCategorySidebar
          brandSlug={slug}
          categories={categoriesWithCounts}
          totalCount={totalProductCount}
          activeCategory={categoria ?? null}
        />

        <section className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-on-surface-variant">
              {productList.length} {productList.length === 1 ? 'resultado' : 'resultados'}
              {activeCategoryName ? (
                <span className="font-medium text-ink"> · {activeCategoryName}</span>
              ) : null}
            </p>
          </div>

          {productList.length === 0 ? (
            <p className="py-20 text-center text-sm text-on-surface-variant">
              Sin productos en esta categoría.{' '}
              <Link href={`/marcas/${slug}`} className="font-semibold text-primary hover:underline">
                Ver todos
              </Link>
            </p>
          ) : (
            <ul className="grid list-none grid-cols-2 gap-4 p-0 sm:gap-5 md:grid-cols-3 md:gap-6">
              {productList.map((product) => (
                <li key={product.id}>
                  <ProductCard
                    variant="editorial"
                    product={{
                      ...product,
                      brand: product.brand as unknown as { name: string; slug: string },
                      category: product.category as unknown as { name: string; slug: string } | null,
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  )
}
