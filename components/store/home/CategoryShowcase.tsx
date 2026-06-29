import Image from 'next/image'
import Link from 'next/link'

export type CategoryShowcaseItem = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
}

interface CategoryShowcaseProps {
  categories: CategoryShowcaseItem[]
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-2xl text-on-surface md:text-[1.75rem]">
            Explora nuestras categorías
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="group relative aspect-3/4 cursor-pointer overflow-hidden bg-zinc-200"
            >
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : 'eager'}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-zinc-200 via-zinc-100 to-zinc-300" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-60" />
              <div className="absolute bottom-8 left-8 text-white md:bottom-10 md:left-10">
                <h3 className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-xl font-medium">
                  {cat.name}
                </h3>
                <span className="mt-2 inline-block border-b border-white pb-1 text-[10px] font-semibold uppercase tracking-widest">
                  Ver productos
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

