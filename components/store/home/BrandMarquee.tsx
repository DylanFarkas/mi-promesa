import Image from 'next/image'
import Link from 'next/link'
import type { Brand } from '@/types/database'

type BrandMarqueeData = Pick<Brand, 'name' | 'slug' | 'logo_url'>

interface BrandMarqueeProps {
  brands: BrandMarqueeData[]
}

export function BrandMarquee({ brands }: BrandMarqueeProps) {
  if (brands.length === 0) return null

  return (
    <section className="border-b border-zinc-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-center justify-between gap-10 opacity-70 md:flex-row">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Marcas destacadas
          </span>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/marcas/${brand.slug}`}
                className="transition-opacity hover:opacity-100"
              >
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain grayscale"
                  />
                ) : (
                  <span className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-lg uppercase tracking-[0.25em] text-zinc-900">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

