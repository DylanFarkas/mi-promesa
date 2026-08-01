'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cloudinaryOptimizedUrl } from '@/lib/cloudinary'
import type { Brand } from '@/types/database'

type BrandShowcaseData = Pick<Brand, 'name' | 'slug' | 'logo_url'>

interface BrandShowcaseProps {
  brands: BrandShowcaseData[]
}

function BrandLogo({ brand, size }: { brand: BrandShowcaseData; size: number }) {
  if (!brand.logo_url) {
    return (
      <span className="px-4 text-center font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-lg font-bold text-on-surface-variant">
        {brand.name}
      </span>
    )
  }

  return (
    <Image
      src={cloudinaryOptimizedUrl(brand.logo_url, size)}
      alt={brand.name}
      width={size}
      height={Math.round(size * 0.6)}
      unoptimized
      className="max-h-full max-w-full object-contain drop-shadow-sm"
    />
  )
}

export function BrandShowcase({ brands }: BrandShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!brands.length) return null

  const activeBrand = brands[activeIndex]

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div
        className="store-dots pointer-events-none absolute inset-0 opacity-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 right-[-5%] h-96 w-96 rounded-full bg-primary/5 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[-10%] h-80 w-80 rounded-full bg-secondary/5 blur-[100px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Cabecera */}
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-20">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-primary uppercase">
              <span aria-hidden>✦</span>
              Marcas aliadas
            </span>
            <h2 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Marcas en las que{' '}
              <span className="store-squiggle text-primary">confiamos</span>
            </h2>
          </div>

          <Link
            href="/marcas"
            className="group flex items-center gap-2 self-start border-b-2 border-ink/30 pb-1.5 text-[11px] font-bold tracking-[0.2em] text-ink uppercase transition-all hover:border-primary hover:text-primary sm:self-auto"
          >
            Ver todas las marcas
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Grid Principal */}
        <div className="grid items-stretch gap-12 lg:grid-cols-[1fr_420px] lg:gap-20 xl:grid-cols-[1fr_480px]">

          {/* Lista de Marcas Interactiva */}
          <ul className="flex flex-col border-t border-outline-variant/40">
            {brands.map((brand, index) => {
              const isActive = index === activeIndex

              return (
                <li key={brand.slug} className="border-b border-outline-variant/40">
                  <Link
                    href={`/marcas/${brand.slug}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className="group relative flex items-center gap-6 py-5 md:py-6 focus-visible:outline-none"
                  >
                    {/* Indicador Activo Lateral */}
                    <span
                      className={[
                        'absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-primary transition-all duration-300 ease-out',
                        isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50',
                      ].join(' ')}
                      aria-hidden
                    />

                    {/* Miniatura Mobile/Tablet */}
                    <span
                      className={[
                        'flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow-sm transition-all duration-300 lg:hidden',
                        isActive ? 'ring-2 ring-primary/20 shadow-md' : '',
                      ].join(' ')}
                      aria-hidden
                    >
                      <BrandLogo brand={brand} size={140} />
                    </span>

                    {/* Nombre de Marca */}
                    <span
                      className={[
                        'flex-1 font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-2xl leading-tight transition-all duration-300 ease-out md:text-[2.1rem]',
                        isActive
                          ? 'translate-x-3 font-semibold text-primary'
                          : 'translate-x-0 font-light text-ink/70 group-hover:translate-x-2 group-hover:text-ink',
                      ].join(' ')}
                    >
                      {brand.name}
                    </span>

                    <ArrowUpRight
                      className={[
                        'size-5 shrink-0 transition-all duration-300 ease-out',
                        isActive
                          ? 'translate-x-1 -translate-y-1 text-primary opacity-100'
                          : 'translate-x-0 text-outline-variant opacity-0 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary group-hover:opacity-100',
                      ].join(' ')}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="hidden lg:block" aria-hidden>
            <div className="group relative flex h-full min-h-120 flex-col overflow-hidden rounded-[2.5rem] bg-white/80 shadow-xl backdrop-blur-xl border border-white/50">

              <div className="absolute inset-0 bg-linear-to-br from-white via-white to-primary/3 pointer-events-none" />

              <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center p-12 xl:p-16">
                {brands.map((brand, index) => (
                  <div
                    key={brand.slug}
                    className={[
                      'absolute inset-0 flex items-center justify-center p-12 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                      index === activeIndex
                        ? 'scale-100 opacity-100 blur-0'
                        : 'scale-90 opacity-0 blur-sm pointer-events-none',
                    ].join(' ')}
                  >
                    <BrandLogo brand={brand} size={600} />
                  </div>
                ))}
              </div>

              <div className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-t border-outline-variant/30 bg-white/50 px-8 py-5 backdrop-blur-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-on-surface-variant uppercase mb-0.5">
                    Marca destacada
                  </span>
                  <span className="truncate text-sm font-bold tracking-wide text-ink uppercase">
                    {activeBrand.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-sm font-bold tabular-nums text-primary">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">/</span>
                  <span className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-sm font-bold tabular-nums text-on-surface-variant">
                    {String(brands.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}