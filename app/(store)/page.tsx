import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  getProductImageFallbacks,
  resolveCategoryImageUrl,
} from '@/lib/store/category-image'
import { ProductCard } from '@/components/store/ProductCard'
import { HomeHero } from '@/components/store/home/HomeHero'
import { BrandShowcase } from '@/components/store/home/BrandShowcase'
import { CategoryShowcase } from '@/components/store/home/CategoryShowcase'
import { BenefitsStrip } from '@/components/store/home/BenefitsStrip'
import { FeatureSection } from '@/components/store/FeatureSection'
import { Reveal } from '@/components/store/Reveal'

const JOURNAL_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDX7wEu7jw27VINmnpIT3sranTNIc0ZFQcck2dgGfN_I_QMJhs9-wxQwWahhkJ8LH8NLdV-DBJfQ90b5wNGMhN-eZeRREfEJR5SqirRHqNWbKt48Oep_NCYBkOuj2CppeuGWV1GyQHP7sGxgoTUdLMyuGk2p0HNPXIC3Fz0ivFtNi4I8A95GIZ6B6_lE9zTP7SAikgepSY2SDIsnfq8TufYYtDMzZ2LOukdIZHl4-tpGeE4Wyn3BCCSKuLuz-OjSH1_JQYuJ2QUE-I'

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
      <HomeHero categories={categories} />

      <Reveal>
        <BrandShowcase brands={brands} />
      </Reveal>

      <Reveal>
        <CategoryShowcase categories={categories} />
      </Reveal>

      {products.length > 0 && (
        <section id="novedades" className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:mb-14">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-primary uppercase">
                  <span aria-hidden>✦</span>
                  Lo más nuevo
                </span>
                <h2 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-4xl font-bold tracking-tight text-ink md:text-5xl">
                  Recién llegados
                </h2>
              </div>
              <Link href="/productos" className="btn-store btn-store--dark self-start">
                Ver todo el catálogo
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>

            {/* Grid dinámico: el primer producto ocupa el doble de espacio */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={index === 0 ? 'col-span-2 row-span-2' : undefined}
                >
                  <ProductCard
                    variant="editorial"
                    showNewBadge
                    product={{
                      ...product,
                      brand: product.brand as unknown as { name: string; slug: string },
                      category: product.category as unknown as { name: string; slug: string } | null,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Reveal>
        <BenefitsStrip />
      </Reveal>

      {/* Marcas seleccionadas
      <FeatureSection
        variant="overlay"
        align="center-left"
        height="lg"
        scrim="soft"
        eyebrow="Marcas seleccionadas"
        title="Lo mejor de cada marca, en un solo lugar"
        description="Trabajamos directamente con las marcas que distribuimos para garantizar productos originales y una experiencia de compra cuidada de principio a fin."
        cta={{ label: 'Explorar marcas', href: '/marcas', variant: 'solid' }}
        media={{
          src: '/images/home-hero.png',
          alt: 'Selección de marcas y productos destacados de Mi Promesa',
          position: '70% center',
        }}
      />

      <FeatureSection
        variant="split"
        mediaSide="left"
        eyebrow="Nuestra historia"
        title="Calidad y confianza en cada elección"
        description="En Mi Promesa distribuimos productos y marcas que aportan valor a tu día a día. Nuestro compromiso es ofrecer variedad, calidad y una atención cercana para que encuentres todo lo que necesitas en un solo lugar."
        cta={{ label: 'Conocer más', href: '/nosotros', variant: 'outline' }}
        media={{ src: JOURNAL_IMAGE, alt: 'Variedad de productos disponibles en Mi Promesa' }}
      />*/}
    </>
  )
}
