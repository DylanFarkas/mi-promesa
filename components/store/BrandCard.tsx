import Link from 'next/link'
import Image from 'next/image'
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
        className=" flex h-full flex-col border border-surface-container bg-white p-8 transition-colors hover:border-outline-variant"
      >
        {brand.logo_url ? (
          <div className="mb-8 flex h-20 items-center justify-center">
            <Image
              src={brand.logo_url}
              alt={`Logo de ${brand.name}`}
              width={180}
              height={80}
              className="max-h-20 w-auto object-contain"
            />
          </div>
        ) : (
          <p className="mb-8 font-serif text-2xl uppercase tracking-[0.2em] text-on-surface">
            {brand.name}
          </p>
        )}

        {brand.logo_url && (
          <h2 className="font-serif text-xl text-on-surface transition-colors group-hover:text-on-surface-variant">
            {brand.name}
          </h2>
        )}

        {brand.description && (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-on-surface-variant">
            {brand.description}
          </p>
        )}

        <footer className="mt-8 flex items-end justify-between gap-4 border-t border-surface-container pt-6">
          {productCount !== undefined ? (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {productCount} {productCount === 1 ? 'producto' : 'productos'}
            </span>
          ) : (
            <span />
          )}
          <span className="border-b border-on-surface pb-0.5 text-[10px] font-semibold uppercase tracking-widest text-on-surface transition-opacity group-hover:opacity-70">
            Explorar
          </span>
        </footer>
      </Link>
    )
  }

  return (
    <Link
      href={`/marcas/${brand.slug}`}
      className="group flex min-h-[160px] flex-col justify-between rounded-2xl border border-stone-100 bg-white p-6 transition-all duration-200 hover:border-rose-200 hover:shadow-md"
    >
      {brand.logo_url && (
        <div className="mb-4 flex h-16 w-full items-center justify-center rounded-xl bg-stone-50 p-3">
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
        <h3 className="text-lg font-bold text-stone-900 transition-colors group-hover:text-rose-600">
          {brand.name}
        </h3>
        {brand.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-400">
            {brand.description}
          </p>
        )}
      </div>

      <footer className="mt-4 flex items-center justify-between">
        {productCount !== undefined ? (
          <span className="text-xs text-stone-400">
            {productCount} {productCount === 1 ? 'producto' : 'productos'}
          </span>
        ) : (
          <span />
        )}
        <span className="flex items-center gap-1 text-xs font-semibold text-rose-500 transition-all group-hover:gap-2">
          Ver productos
        </span>
      </footer>
    </Link>
  )
}
