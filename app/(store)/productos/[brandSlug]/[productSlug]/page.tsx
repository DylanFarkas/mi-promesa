import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { ProductGallery } from '@/components/store/ProductGallery'
import { ProductActions } from '@/components/store/ProductActions'
import { ProductCard } from '@/components/store/ProductCard'

interface Props {
  params: Promise<{ brandSlug: string; productSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandSlug, productSlug } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('id, name')
    .eq('slug', brandSlug)
    .single()

  if (!brand) return { title: 'Producto no encontrado' }

  const { data: product } = await supabase
    .from('products')
    .select('name, short_description, primary_image_url')
    .eq('slug', productSlug)
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .single()

  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: `${product.name} — ${brand.name}`,
    description: product.short_description ?? `${product.name} de ${brand.name}`,
    openGraph: product.primary_image_url
      ? { images: [{ url: product.primary_image_url }] }
      : undefined,
  }
}

export const revalidate = 60

export default async function ProductPage({ params }: Props) {
  const { brandSlug, productSlug } = await params
  const supabase = await createClient()

  // Fetch brand
  const { data: brand } = await supabase
    .from('brands')
    .select('id, name, slug')
    .eq('slug', brandSlug)
    .eq('is_active', true)
    .single()

  if (!brand) notFound()

  // Fetch product with category
  const { data: product } = await supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, primary_image_url, short_description, description, sku, category_id, category:categories!category_id!inner(name, slug, brand_id)',
    )
    .eq('slug', productSlug)
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const { data: extraCategoryRows } = await supabase
    .from('product_categories')
    .select('categories ( name, slug, brand_id )')
    .eq('product_id', product.id)

  type CatRow = { name: string; slug: string; brand_id: string | null }
  function embeddedCategory(row: unknown): CatRow | null {
    const c = (row as { categories?: CatRow | CatRow[] | null }).categories
    if (c == null) return null
    return Array.isArray(c) ? (c[0] ?? null) : c
  }
  const extraCategories: CatRow[] = (extraCategoryRows ?? [])
    .map(embeddedCategory)
    .filter((c): c is CatRow => c != null)

  // Gallery images
  const { data: galleryImages } = await supabase
    .from('product_images')
    .select('url, alt_text')
    .eq('product_id', product.id)
    .order('sort_order')

  // Related products
  const { data: related } = await supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, primary_image_url, short_description, brand:brands!inner(name, slug)',
    )
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(4)

  const hasDiscount =
    product.compare_at_price !== null && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  const productForCart = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compare_at_price: product.compare_at_price,
    primary_image_url: product.primary_image_url,
    short_description: product.short_description,
    brand: { name: brand.name, slug: brand.slug },
  }

  const category = product.category as unknown as {
    name: string
    slug: string
    brand_id?: string | null
  } | null

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-stone-600 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/marcas" className="hover:text-stone-600 transition-colors">Marcas</Link>
        <ChevronRight size={12} />
        <Link href={`/marcas/${brand.slug}`} className="hover:text-stone-600 transition-colors">
          {brand.name}
        </Link>
        <ChevronRight size={12} />
        <span className="text-stone-700 font-medium truncate max-w-[160px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <ProductGallery
          mainImage={product.primary_image_url}
          images={galleryImages ?? []}
          productName={product.name}
        />

        {/* Details */}
        <div className="flex flex-col gap-5">
          {/* Brand + Category tags */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/marcas/${brand.slug}`}
              className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
            >
              {brand.name}
            </Link>
            {category && (
              <Link
                href={
                  category.brand_id
                    ? `/marcas/${brand.slug}?categoria=${category.slug}`
                    : `/categorias/${category.slug}`
                }
                className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500 hover:bg-stone-200 transition-colors"
              >
                <Tag size={10} />
                {category.name}
              </Link>
            )}
            {extraCategories.map((c) => (
              <Link
                key={`${c.slug}-${c.brand_id ?? 'g'}`}
                href={
                  c.brand_id
                    ? `/marcas/${brand.slug}?categoria=${c.slug}`
                    : `/categorias/${c.slug}`
                }
                className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500 hover:bg-stone-200 transition-colors"
              >
                <Tag size={10} />
                {c.name}
              </Link>
            ))}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="mt-2 text-stone-500 leading-relaxed">{product.short_description}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-stone-900">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-stone-400 line-through">
                  {formatCurrency(product.compare_at_price!)}
                </span>
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-sm font-bold text-rose-600">
                  -{discountPct}%
                </span>
              </>
            )}
          </div>

          {product.sku && (
            <p className="text-xs text-stone-400">SKU: {product.sku}</p>
          )}

          <div className="border-t border-stone-100" />

          {/* Add to cart */}
          <ProductActions product={productForCart} />

          {/* Description */}
          {product.description && (
            <div className="border-t border-stone-100 pt-5">
              <h2 className="text-sm font-semibold text-stone-800 mb-3">Descripción</h2>
              <div className="text-sm text-stone-500 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}

          {/* WhatsApp CTA */}
          <div className="mt-2 rounded-2xl bg-stone-50 border border-stone-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-stone-700">¿Tienes preguntas?</p>
              <p className="text-xs text-stone-400 mt-0.5">
                Coordina tu pedido directamente por WhatsApp.
              </p>
            </div>
            <a
              href={`https://wa.me/521xxxxxxxxxx?text=${encodeURIComponent(`Hola, me interesa el producto: ${product.name} (${brand.name})`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Related products */}
      {(related ?? []).length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900">Más de {brand.name}</h2>
            <Link
              href={`/marcas/${brand.slug}`}
              className="text-sm text-rose-500 hover:text-rose-600 transition-colors"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related!.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  brand: p.brand as unknown as { name: string; slug: string },
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
