import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export type CategoryShowcaseItem = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
}

interface CategoryShowcaseProps {
  categories: CategoryShowcaseItem[]
}

/** Tintes con personalidad distinta para las tarjetas secundarias. */
const SIDE_TINTS = [
  {
    bg: 'bg-mint',
    back: 'bg-mint-deep',
    text: 'text-mint-deep',
    chip: 'bg-mint-deep text-white',
  },
  {
    bg: 'bg-blush',
    back: 'bg-accent',
    text: 'text-accent',
    chip: 'bg-accent text-white',
  },
] as const

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null

  const [featured, ...rest] = categories
  const side = rest.slice(0, 2)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Encabezado editorial a dos columnas */}
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[1.2fr_1fr] md:items-end">
          <h2 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Explora
            <span className="text-primary"> y descubre</span>
            <span className="ml-2 text-2xl text-secondary md:text-3xl" aria-hidden>
              ✦
            </span>
          </h2>
          <div className="space-y-3 md:justify-self-end md:text-right">
            <p className="max-w-sm text-sm leading-relaxed text-on-surface-variant md:ml-auto">
              Cada categoría tiene su propio mundo: salud, hogar, bienestar, belleza y más.
            </p>
            <Link
              href="/categorias"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary-deep"
            >
              Ver todas las categorías
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-5 lg:grid-rows-2 lg:gap-6">
          {/* Protagonista: imagen a sangre con titular grande */}
          <Link
            href={`/categorias/${featured.slug}`}
            className="group relative block overflow-hidden rounded-4xl shadow-card transition-all duration-500 hover:shadow-lift lg:col-span-3 lg:row-span-2"
          >
            <div className="relative aspect-4/5 sm:aspect-16/11 lg:aspect-auto lg:h-full lg:min-h-136">
              {featured.imageUrl ? (
                <Image
                  src={featured.imageUrl}
                  alt={featured.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-primary-soft via-surface to-secondary-container" />
              )}
              <div
                className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/15 to-transparent"
                aria-hidden
              />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 md:p-9">
                <div>
                  <span className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-bold tracking-wide text-ink uppercase">
                    Destacado
                  </span>
                  <h3 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-3xl font-bold text-white md:text-4xl">
                    {featured.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-white/80">Ver productos</p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-all duration-300 group-hover:rotate-45 group-hover:bg-secondary">
                  <ArrowUpRight size={20} aria-hidden />
                </span>
              </div>
            </div>
          </Link>

          {/* Secundarias: composición horizontal sobre fondo tintado */}
          {side.map((cat, i) => {
            const tint = SIDE_TINTS[i % SIDE_TINTS.length]
            return (
              <div
                key={cat.id}
                className="group relative h-full lg:col-span-2"
              >
                {/* Offset micro: misma altura que la face (h-full) para que no quede solapa */}
                <span
                  className={`store-sticker-back store-sticker-back--micro rounded-4xl ${tint.back}`}
                  aria-hidden
                />
                <Link
                  href={`/categorias/${cat.slug}`}
                  className={`relative flex h-full min-h-40 overflow-hidden rounded-4xl ${tint.bg} shadow-card transition-all duration-500 group-hover:-translate-y-0.5 hover:shadow-lift`}
                >
                  <div className="flex flex-1 flex-col justify-between gap-6 p-7">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${tint.chip} transition-transform duration-300 group-hover:rotate-45`}
                    >
                      <ArrowUpRight size={15} aria-hidden />
                    </span>
                    <div>
                      <h3
                        className={`font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-2xl font-bold ${tint.text}`}
                      >
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-ink/60">Ver productos</p>
                    </div>
                  </div>

                  <div className="relative w-[42%] shrink-0 self-stretch overflow-hidden">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt=""
                        fill
                        className="rounded-l-[3rem] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 1024px) 42vw, 320px"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center rounded-l-[3rem] bg-white/60 text-3xl font-bold text-ink/30">
                        {cat.name.slice(0, 1)}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
