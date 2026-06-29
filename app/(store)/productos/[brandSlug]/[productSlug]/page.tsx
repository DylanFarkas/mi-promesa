import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
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

  const { data: brand } = await supabase
    .from('brands')
    .select('id, name, slug')
    .eq('slug', brandSlug)
    .eq('is_active', true)
    .single()

  if (!brand) notFound()

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

  const { data: galleryImages } = await supabase
    .from('product_images')
    .select('url, alt_text')
    .eq('product_id', product.id)
    .order('sort_order')

  const { data: related } = await supabase
    .from('products')
    .select(
      'id, name, slug, price, compare_at_price, primary_image_url, short_description, brand:brands!inner(name, slug), category:categories!category_id(name, slug)',
    )
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(3)

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

  const categoryHref = category
    ? category.brand_id
      ? `/marcas/${brand.slug}?categoria=${category.slug}`
      : `/categorias/${category.slug}`
    : null

  const whatsAppHref = `https://wa.me/521xxxxxxxxxx?text=${encodeURIComponent(
    `Hola, me interesa el producto: ${product.name} (${brand.name})`,
  )}`

  return (
    <article className="mx-auto max-w-7xl px-6 py-10 md:px-8">
      <nav
        aria-label="Ruta de navegación"
        className="mb-10 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant md:mb-12"
      >
        <Link href="/" className="transition-colors hover:text-on-surface">
          Inicio
        </Link>
        <ChevronRight size={12} className="shrink-0" aria-hidden />
        {category && !category.brand_id ? (
          <>
            <Link href="/categorias" className="transition-colors hover:text-on-surface">
              Categorías
            </Link>
            <ChevronRight size={12} className="shrink-0" aria-hidden />
            <Link href={categoryHref!} className="transition-colors hover:text-on-surface">
              {category.name}
            </Link>
            <ChevronRight size={12} className="shrink-0" aria-hidden />
          </>
        ) : (
          <>
            <Link href="/marcas" className="transition-colors hover:text-on-surface">
              Marcas
            </Link>
            <ChevronRight size={12} className="shrink-0" aria-hidden />
            <Link
              href={`/marcas/${brand.slug}`}
              className="transition-colors hover:text-on-surface"
            >
              {brand.name}
            </Link>
            <ChevronRight size={12} className="shrink-0" aria-hidden />
          </>
        )}
        <span className="font-bold text-on-surface">{product.name}</span>
      </nav>

      <section className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ProductGallery
            variant="editorial"
            mainImage={product.primary_image_url}
            images={galleryImages ?? []}
            productName={product.name}
          />
        </div>

        <div className="flex flex-col gap-8 lg:col-span-5 lg:sticky lg:top-32 lg:h-fit lg:gap-10">
          <header>
            {hasDiscount ? (
              <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-[#e9c176]">
                Oferta · -{discountPct}%
              </span>
            ) : (
              <Link
                href={`/marcas/${brand.slug}`}
                className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-secondary transition-opacity hover:opacity-70"
              >
                {brand.name}
              </Link>
            )}
            <h1 className="font-serif text-3xl leading-tight text-on-surface md:text-4xl">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="mt-2 font-serif text-lg font-light italic text-on-surface-variant">
                {product.short_description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <span className="font-serif text-2xl text-on-surface">
                {formatCurrency(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-on-surface-variant line-through">
                  {formatCurrency(product.compare_at_price!)}
                </span>
              )}
            </div>
            {product.sku && (
              <p className="mt-3 text-[10px] uppercase tracking-widest text-zinc-400">
                SKU {product.sku}
              </p>
            )}
            {(category || extraCategories.length > 0) && (
              <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-on-surface-variant">
                {category && (
                  <Link href={categoryHref!} className="underline-offset-4 hover:underline">
                    {category.name}
                  </Link>
                )}
                {extraCategories.map((c) => {
                  const href = c.brand_id
                    ? `/marcas/${brand.slug}?categoria=${c.slug}`
                    : `/categorias/${c.slug}`
                  return (
                    <Link key={`${c.slug}-${c.brand_id ?? 'g'}`} href={href} className="hover:underline">
                      {c.name}
                    </Link>
                  )
                })}
              </p>
            )}
          </header>

          <ProductActions
            variant="editorial"
            product={productForCart}
            whatsAppHref={whatsAppHref}
          />

          {product.description && (
            <section className="border-t border-outline-variant pt-8 md:pt-10">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-on-surface">
                La historia
              </h2>
              <div className="text-base leading-relaxed whitespace-pre-line text-on-surface-variant">
                {product.description}
              </div>
            </section>
          )}
        </div>
      </section>

      {(related ?? []).length > 0 && (
        <section className="border-t border-zinc-100 pt-12 md:pt-16">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12">
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                También te puede interesar
              </span>
              <h2 className="font-serif text-2xl text-on-surface md:text-[1.75rem]">
                Más de esta marca
              </h2>
            </div>
            <Link
              href={`/marcas/${brand.slug}`}
              className="border-b border-on-surface pb-1 text-xs font-semibold uppercase tracking-widest text-on-surface transition-opacity hover:opacity-70"
            >
              Ver todos los productos
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {related!.map((p) => (
              <ProductCard
                key={p.id}
                variant="editorial"
                product={{
                  ...p,
                  brand: p.brand as unknown as { name: string; slug: string },
                  category: p.category as unknown as { name: string; slug: string } | null,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
