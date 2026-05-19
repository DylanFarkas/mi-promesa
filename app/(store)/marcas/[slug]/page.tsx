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

  // Fetch brand
  const { data: brand } = await supabase
    .from('brands')
    .select('id, name, slug, description')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!brand) notFound()

  // Fetch categories for this brand
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .order('sort_order')

  // Build product query
  let productQuery = supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, primary_image_url, short_description, category_id, brand:brands!inner(name, slug)',
    )
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (categoria) {
    const cat = (categories ?? []).find((c) => c.slug === categoria)
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-8">
        <Link href="/" className="hover:text-stone-600 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/marcas" className="hover:text-stone-600 transition-colors">Marcas</Link>
        <ChevronRight size={12} />
        <span className="text-stone-700 font-medium">{brand.name}</span>
      </nav>

      {/* Brand header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-1">Marca</p>
        <h1 className="text-3xl font-bold text-stone-900">{brand.name}</h1>
        {brand.description && (
          <p className="mt-2 text-stone-500 text-sm max-w-xl leading-relaxed">{brand.description}</p>
        )}
      </div>

      {/* Category filters */}
      {(categories ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={`/marcas/${slug}`}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              !categoria
                ? 'bg-stone-900 text-white'
                : 'border border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50',
            ].join(' ')}
          >
            Todos
          </Link>
          {(categories ?? []).map((cat) => (
            <Link
              key={cat.id}
              href={`/marcas/${slug}?categoria=${cat.slug}`}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                categoria === cat.slug
                  ? 'bg-stone-900 text-white'
                  : 'border border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50',
              ].join(' ')}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Products */}
      {(products ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <p className="text-base font-medium">Sin productos disponibles</p>
          <p className="text-sm mt-1">Intenta con otra categoría o vuelve pronto.</p>
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
