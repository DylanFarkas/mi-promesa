import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  fetchProductIdsWithAdditionalCategory,
  productsInCategoryOrFilter,
} from '@/lib/supabase/productCategories'
import { getCategoryBrandCounts } from '@/lib/store/category-counts'
import { CategoryBrandSidebar } from '@/components/store/categories/CategoryBrandSidebar'
import { ProductCard } from '@/components/store/ProductCard'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ marca?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: cat } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .is('brand_id', null)
    .eq('is_active', true)
    .single()

  if (!cat) return { title: 'Categoría no encontrada' }
  return {
    title: cat.name,
    description: cat.description ?? `Productos de la categoría ${cat.name}`,
  }
}

export const revalidate = 60

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { marca } = await searchParams
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .eq('slug', slug)
    .is('brand_id', null)
    .eq('is_active', true)
    .single()

  if (!category) notFound()

  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order')

  const brandList = brands ?? []
  const { total: totalProductCount, brands: brandsWithCounts } =
    await getCategoryBrandCounts(supabase, category.id, brandList)

  const additionalProductIds = await fetchProductIdsWithAdditionalCategory(
    supabase,
    category.id,
  )
  const catFilter = productsInCategoryOrFilter(category.id, additionalProductIds)

  let productQuery = supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, primary_image_url, short_description, brand:brands!inner(name, slug), category:categories!category_id(name, slug)',
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  productQuery =
    catFilter.mode === 'primary_only'
      ? productQuery.eq('category_id', catFilter.categoryId)
      : productQuery.or(catFilter.or)

  if (marca) {
    const brandMatch = brandList.find((b) => b.slug === marca)
    if (brandMatch) productQuery = productQuery.eq('brand_id', brandMatch.id)
  }

  const { data: products } = await productQuery
  const productList = products ?? []
  const activeBrandName = marca ? brandList.find((b) => b.slug === marca)?.name : null

  return (
    <article className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-12">
      <nav
        aria-label="Ruta de navegación"
        className="mb-10 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant md:mb-12"
      >
        <Link href="/" className="transition-colors hover:text-on-surface">
          Inicio
        </Link>
        <ChevronRight size={12} className="shrink-0" aria-hidden />
        <Link href="/categorias" className="transition-colors hover:text-on-surface">
          Categorías
        </Link>
        <ChevronRight size={12} className="shrink-0" aria-hidden />
        <span className="font-bold text-on-surface">{category.name}</span>
      </nav>

      <header className="mb-12 grid grid-cols-1 items-end gap-10 border-b border-zinc-100 pb-12 lg:mb-16 lg:grid-cols-2 lg:gap-16 lg:pb-16">
        <div>
          <h1 className="font-serif text-3xl leading-tight text-on-surface md:text-4xl lg:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant">
              {category.description}
            </p>
          )}
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

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <CategoryBrandSidebar
          categorySlug={slug}
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
              Sin productos en esta categoría.{' '}
              <Link href={`/categorias/${slug}`} className="underline hover:text-on-surface">
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
    </article>
  )
}
