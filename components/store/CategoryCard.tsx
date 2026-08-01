import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

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
        className="group flex h-full flex-col rounded-[1.75rem] bg-white p-2 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
      >
        <figure className="relative aspect-4/3 overflow-hidden rounded-[1.4rem] bg-surface">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary-soft via-surface to-secondary-container" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
            <h2 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-xl font-bold text-white">
              {category.name}
            </h2>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition-all duration-300 group-hover:rotate-45 group-hover:bg-secondary">
              <ArrowUpRight size={16} aria-hidden />
            </span>
          </figcaption>
        </figure>

        <div className="flex flex-1 flex-col gap-3 p-5 pt-4">
          {category.description && (
            <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-on-surface-variant">
              {category.description}
            </p>
          )}
          <footer className="mt-auto flex items-center justify-between gap-4">
            {productCount !== undefined ? (
              <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-on-surface-variant">
                {productCount} {productCount === 1 ? 'producto' : 'productos'}
              </span>
            ) : (
              <span />
            )}
            <span className="text-sm font-bold text-primary transition-colors group-hover:text-primary-deep">
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
      className="group flex min-h-35 flex-col justify-between rounded-3xl bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div>
        <h2 className="text-lg font-bold text-ink transition-colors group-hover:text-primary">
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
            {category.description}
          </p>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <span className="text-xs font-bold text-primary">Ver productos</span>
      </div>
    </Link>
  )
}
