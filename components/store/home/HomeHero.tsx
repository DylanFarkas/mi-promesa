import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react'
import { HeroMarquee } from '@/components/store/home/HeroMarquee'

export type HomeHeroCategory = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
}

interface HomeHeroProps {
  categories?: HomeHeroCategory[]
}

/** Formas editoriales del collage: arco, radio generoso y esquina asimétrica. */
const COLLAGE_SHAPES = [
  { frame: 'store-arch', offset: 'md:mb-0', aspect: 'aspect-[3/4]' },
  { frame: 'rounded-[2.25rem]', offset: 'md:mb-14', aspect: 'aspect-[3/4]' },
  { frame: 'rounded-[2.25rem] md:rounded-tr-[7rem]', offset: 'md:mb-7', aspect: 'aspect-[3/4]' },
] as const

/** Sello circular giratorio: firma gráfica de la marca. */
function PromiseStamp({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <svg viewBox="0 0 120 120" className="store-stamp h-full w-full">
        <defs>
          <path
            id="stamp-circle"
            d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"
            fill="none"
          />
        </defs>
        <circle cx="60" cy="60" r="59" className="fill-secondary" />
        <text
          className="fill-ink text-[10px] font-bold uppercase"
          style={{
            fontFamily: 'var(--font-store-display-face), system-ui, sans-serif',
            letterSpacing: '0.22em',
          }}
        >
          <textPath href="#stamp-circle">mi promesa · todo en un solo lugar ·</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl text-ink">
        ✦
      </span>
    </div>
  )
}

export function HomeHero({ categories = [] }: HomeHeroProps) {
  const collage = categories.slice(0, 3)

  return (
    <section className="relative -mt-16 overflow-hidden bg-paper md:-mt-20">
      {/* Atmósfera: textura de puntos + resplandores suaves de cobalto y amarillo */}
      <div
        className="store-dots pointer-events-none absolute inset-x-0 top-0 h-2/3 opacity-50 mask-[linear-gradient(to_bottom,black,transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-48 right-[-12%] h-136 w-136 rounded-full bg-primary-soft/80 blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[40%] left-[-10%] h-80 w-80 rounded-full bg-secondary-container/70 blur-[90px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-14 md:px-8 md:pt-40 md:pb-16">
        <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold tracking-wide text-white shadow-md shadow-ink/20">
          <span className="text-secondary" aria-hidden>
            ✦
          </span>
          Tu tienda de confianza
        </span>

        <h1 className="mt-7 max-w-5xl font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-[2.7rem] font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[5.25rem] lg:leading-[0.98]">
          Todo lo que necesitas,
          <br />
          <span className="store-squiggle text-primary">en un solo lugar</span>
        </h1>

        <div className="mt-9 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-lg space-y-6">
            <p className="text-base leading-relaxed text-on-surface-variant md:text-lg">
              Productos médicos, bienestar, hogar, cuidado personal, suplementos, licores y más.
              Siempre hay algo nuevo por descubrir.
            </p>

            <Link
              href="/buscar"
              className="group flex w-full max-w-md items-center gap-3 rounded-full bg-white p-2 pl-6 shadow-float transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none"
            >
              <Search size={18} className="shrink-0 text-primary" aria-hidden />
              <span className="flex-1 text-sm text-on-surface-variant">
                ¿Qué estás buscando hoy?
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors duration-300 group-hover:bg-primary-deep sm:w-auto sm:px-6">
                <span className="hidden text-sm font-bold sm:inline">Buscar</span>
                <ArrowRight size={16} className="sm:hidden" aria-hidden />
              </span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/productos" className="btn-store btn-store--primary">
              Explorar catálogo
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="/categorias" className="btn-store btn-store--ghost">
              Ver categorías
            </Link>
          </div>
        </div>

        {/* Collage editorial de categorías: cada una con su propia forma y altura */}
        {collage.length > 0 && (
          <div className="relative mt-14 md:mt-20">
            <PromiseStamp className="absolute -top-12 right-[4%] z-10 hidden h-28 w-28 drop-shadow-lg md:block lg:h-32 lg:w-32" />

            <div className="grid grid-cols-3 items-end gap-3 md:gap-6">
              {collage.map((cat, i) => {
                const shape = COLLAGE_SHAPES[i % COLLAGE_SHAPES.length]
                return (
                  <Link
                    key={cat.id}
                    href={`/categorias/${cat.slug}`}
                    className={`group relative block overflow-hidden ${shape.frame} ${shape.offset} ${shape.aspect} shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-lift`}
                  >
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        priority={i === 0}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 33vw, 400px"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary-soft via-surface to-secondary-container text-4xl font-bold text-primary">
                        {cat.name.slice(0, 1)}
                      </span>
                    )}

                    <span
                      className="absolute inset-0 bg-linear-to-t from-ink/50 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                      aria-hidden
                    />

                    <span className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 rounded-full bg-white/90 py-2 pr-2 pl-4 backdrop-blur-sm md:inset-x-4 md:bottom-4">
                      <span className="truncate text-xs font-bold text-ink md:text-sm">
                        {cat.name}
                      </span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary md:h-7 md:w-7">
                        <ArrowUpRight size={13} aria-hidden />
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <HeroMarquee />
    </section>
  )
}
