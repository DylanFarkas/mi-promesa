import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  fetchProductIdsWithAdditionalCategory,
  productsInCategoryOrFilter,
} from '@/lib/supabase/productCategories'
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

  // Fetch brands for filter
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order')

  const additionalProductIds = await fetchProductIdsWithAdditionalCategory(
    supabase,
    category.id,
  )
  const catFilter = productsInCategoryOrFilter(category.id, additionalProductIds)

  let productQuery = supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, primary_image_url, short_description, brand:brands!inner(name, slug)',
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  productQuery =
    catFilter.mode === 'primary_only'
      ? productQuery.eq('category_id', catFilter.categoryId)
      : productQuery.or(catFilter.or)

  if (marca) {
    const brandMatch = (brands ?? []).find((b) => b.slug === marca)
    if (brandMatch) productQuery = productQuery.eq('brand_id', brandMatch.id)
  }

  const { data: products } = await productQuery

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-8">
        <Link href="/" className="hover:text-stone-600 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/categorias" className="hover:text-stone-600 transition-colors">Categorías</Link>
        <ChevronRight size={12} />
        <span className="text-stone-700 font-medium">{category.name}</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-1">Categoría</p>
        <h1 className="text-3xl font-bold text-stone-900">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-stone-500 text-sm max-w-xl leading-relaxed">{category.description}</p>
        )}
      </div>

      {/* Brand filter */}
      {(brands ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={`/categorias/${slug}`}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              !marca
                ? 'bg-stone-900 text-white'
                : 'border border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50',
            ].join(' ')}
          >
            Todas las marcas
          </Link>
          {(brands ?? []).map((b) => (
            <Link
              key={b.id}
              href={`/categorias/${slug}?marca=${b.slug}`}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                marca === b.slug
                  ? 'bg-stone-900 text-white'
                  : 'border border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50',
              ].join(' ')}
            >
              {b.name}
            </Link>
          ))}
        </div>
      )}

      {(products ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <p className="text-base font-medium">Sin productos disponibles</p>
          <p className="text-sm mt-1">Intenta con otra marca o vuelve pronto.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-stone-400 mb-4">
            {products!.length} {products!.length === 1 ? 'producto' : 'productos'}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products!.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  brand: product.brand as unknown as { name: string; slug: string },
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
