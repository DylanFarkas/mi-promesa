import Link from 'next/link'
import Image from 'next/image'

export type CategoryCardData = {
  name: string
  slug: string
  description: string | null
  imageUrl?: string | null
}

interface CategoryCardProps {
  category: CategoryCardData
  productCount?: number
  variant?: 'default' | 'editorial'
}

export function CategoryCard({
  category,
  productCount,
  variant = 'default',
}: CategoryCardProps) {
  if (variant === 'editorial') {
    return (
      <Link
        href={`/categorias/${category.slug}`}
        className="group flex h-full flex-col overflow-hidden border border-surface-container bg-white transition-colors hover:border-outline-variant"
      >
        <figure className="relative aspect-4/3 overflow-hidden bg-surface-container">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-zinc-200 via-zinc-100 to-zinc-300" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />
          <figcaption className="absolute bottom-0 left-0 p-6">
            <h2 className="font-serif text-xl text-white">{category.name}</h2>
          </figcaption>
        </figure>

        <div className="flex flex-1 flex-col p-6">
          {category.description && (
            <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-on-surface-variant">
              {category.description}
            </p>
          )}
          <footer className="mt-6 flex items-end justify-between gap-4 border-t border-surface-container pt-5">
            {productCount !== undefined ? (
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                {productCount} {productCount === 1 ? 'producto' : 'productos'}
              </span>
            ) : (
              <span />
            )}
            <span className="border-b border-on-surface pb-0.5 text-[10px] font-semibold uppercase tracking-widest text-on-surface transition-opacity group-hover:opacity-70">
              Explorar
            </span>
          </footer>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="group flex min-h-[140px] flex-col justify-between rounded-2xl border border-stone-100 bg-white p-6 transition-all duration-200 hover:border-rose-200 hover:shadow-md"
    >
      <div>
        <h2 className="text-lg font-bold text-stone-900 transition-colors group-hover:text-rose-600">
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-400">
            {category.description}
          </p>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <span className="text-xs font-semibold text-rose-500">Ver productos</span>
      </div>
    </Link>
  )
}
