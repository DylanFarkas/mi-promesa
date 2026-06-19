import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { countProductsInCategory } from '@/lib/store/category-counts'
import {
  getProductImageFallback,
  resolveCategoryImageUrl,
} from '@/lib/store/category-image'
import { CategoryCard } from '@/components/store/CategoryCard'

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Navega por nuestras categorías de productos.',
}

export const revalidate = 60

export default async function CategoriasPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url')
    .is('brand_id', null)
    .eq('is_active', true)
    .order('sort_order')

  const categoryList = categories ?? []

  const categoriesWithMeta = await Promise.all(
    categoryList.map(async (cat) => {
      const productCount = await countProductsInCategory(supabase, cat.id)
      const productFallback = cat.image_url
        ? null
        : await getProductImageFallback(supabase, cat.id)

      return {
        ...cat,
        productCount,
        imageUrl: resolveCategoryImageUrl(cat.image_url, productFallback),
      }
    }),
  )

  return (
    <article className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-16">
      <header className="mb-12 border-b border-zinc-100 pb-10 md:mb-16 md:pb-14">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          Navegar
        </span>
        <h1 className="font-serif text-3xl text-on-surface md:text-4xl lg:text-[2.75rem] lg:leading-tight">
          Categorías
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-on-surface-variant">
          Explora nuestros productos organizados por tipo. Cada categoría reúne lo mejor de nuestro
          catálogo curado.
        </p>
      </header>

      {categoriesWithMeta.length === 0 ? (
        <p className="py-24 text-center text-sm text-zinc-400">Próximamente</p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {categoriesWithMeta.map((cat) => (
            <li key={cat.id}>
              <CategoryCard
                variant="editorial"
                category={{
                  name: cat.name,
                  slug: cat.slug,
                  description: cat.description,
                  imageUrl: cat.imageUrl,
                }}
                productCount={cat.productCount}
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
