import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { Brand } from '@/types/database'

type BrandCardData = Pick<Brand, 'name' | 'slug' | 'description' | 'logo_url'>

interface BrandCardProps {
  brand: BrandCardData
  productCount?: number
  variant?: 'default' | 'editorial'
}

export function BrandCard({ brand, productCount, variant = 'default' }: BrandCardProps) {
  if (variant === 'editorial') {
    return (
      <Link
        href={`/marcas/${brand.slug}`}
        className="group flex h-full flex-col rounded-[1.75rem] bg-white p-7 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
      >
        {brand.logo_url ? (
          <div className="mb-6 flex h-24 items-center justify-center rounded-[1.25rem] bg-surface p-4 transition-colors duration-300 group-hover:bg-primary-soft/60">
            <Image
              src={brand.logo_url}
              alt={`Logo de ${brand.name}`}
              width={180}
              height={80}
              className="max-h-16 w-auto object-contain"
            />
          </div>
        ) : (
          <p className="mb-6 font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-2xl font-bold tracking-tight text-ink">
            {brand.name}
          </p>
        )}

        {brand.logo_url && (
          <h2 className="text-lg font-bold text-ink transition-colors group-hover:text-primary">
            {brand.name}
          </h2>
        )}

        {brand.description && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-on-surface-variant">
            {brand.description}
          </p>
        )}

        <footer className="mt-6 flex items-center justify-between gap-4">
          {productCount !== undefined ? (
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-on-surface-variant">
              {productCount} {productCount === 1 ? 'producto' : 'productos'}
            </span>
          ) : (
            <span />
          )}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary">
            <ArrowUpRight size={16} aria-hidden />
          </span>
        </footer>
      </Link>
    )
  }

  return (
    <Link
      href={`/marcas/${brand.slug}`}
      className="group flex min-h-40 flex-col justify-between rounded-3xl bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      {brand.logo_url && (
        <div className="mb-4 flex h-16 w-full items-center justify-center rounded-xl bg-surface p-3">
          <Image
            src={brand.logo_url}
            alt={`Logo de ${brand.name}`}
            width={160}
            height={64}
            className="max-h-12 w-auto object-contain"
          />
        </div>
      )}
      <div>
        <h3 className="text-lg font-bold text-ink transition-colors group-hover:text-primary">
          {brand.name}
        </h3>
        {brand.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
            {brand.description}
          </p>
        )}
      </div>

      <footer className="mt-4 flex items-center justify-between">
        {productCount !== undefined ? (
          <span className="text-xs text-on-surface-variant">
            {productCount} {productCount === 1 ? 'producto' : 'productos'}
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs font-bold text-primary">Ver productos</span>
      </footer>
    </Link>
  )
}
