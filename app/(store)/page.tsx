import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  getProductImageFallbacks,
  resolveCategoryImageUrl,
} from '@/lib/store/category-image'
import { ProductCard } from '@/components/store/ProductCard'
import { HomeHero } from '@/components/store/home/HomeHero'
import { BrandMarquee } from '@/components/store/home/BrandMarquee'
import { CategoryShowcase } from '@/components/store/home/CategoryShowcase'
import { BenefitsStrip } from '@/components/store/home/BenefitsStrip'
import { HomeJournal } from '@/components/store/home/HomeJournal'

export const revalidate = 60

async function getData() {
  const supabase = await createClient()

  const [brandsRes, productsRes, categoriesRes] = await Promise.all([
    supabase
      .from('brands')
      .select('id, name, slug, description, logo_url')
      .eq('is_active', true)
      .order('sort_order')
      .limit(6),
    supabase
      .from('products')
      .select(
        'id, name, slug, price, compare_at_price, primary_image_url, short_description, brand:brands!inner(name, slug), category:categories!category_id(name, slug)',
      )
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('categories')
      .select('id, name, slug, image_url')
      .is('brand_id', null)
      .eq('is_active', true)
      .order('sort_order')
      .limit(3),
  ])

  const categories = categoriesRes.data ?? []
  const categoriesNeedingFallback = categories.filter((c) => !c.image_url)
  const categoryImages = await getProductImageFallbacks(
    supabase,
    categoriesNeedingFallback.map((c) => c.id),
  )

  return {
    brands: brandsRes.data ?? [],
    products: productsRes.data ?? [],
    categories: categories.map((c) => ({
      ...c,
      imageUrl: resolveCategoryImageUrl(c.image_url, categoryImages[c.id] ?? null),
    })),
  }
}

export default async function HomePage() {
  const { brands, products, categories } = await getData()

  return (
    <>
      <HomeHero />

      <BrandMarquee brands={brands} />

      <CategoryShowcase categories={categories} />

      {products.length > 0 && (
        <section id="novedades" className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-16">
              <div>
                <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  Lo más nuevo
                </span>
                <h2 className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-2xl text-on-surface md:text-[1.75rem]">
                  Esenciales para tu santuario
                </h2>
              </div>
              <Link
                href="/productos"
                className="border-b border-on-surface pb-1 text-xs font-semibold uppercase tracking-widest text-on-surface transition-opacity hover:opacity-70"
              >
                Ver todo el catálogo
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  variant="editorial"
                  product={{
                    ...product,
                    brand: product.brand as unknown as { name: string; slug: string },
                    category: product.category as unknown as { name: string; slug: string } | null,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <BenefitsStrip />

      <HomeJournal />
    </>
  )
}
