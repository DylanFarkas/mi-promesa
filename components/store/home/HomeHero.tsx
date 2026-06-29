import Image from 'next/image'
import Link from 'next/link'

const HERO_IMAGE = '/images/home-hero.png'

export function HomeHero() {
  return (
    <section className="relative -mt-16 flex min-h-dvh items-center overflow-hidden bg-[#E2D1C3] md:-mt-20">
      <figure className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt="Amplio catálogo de productos para hogar, belleza, nutrición y más"
          fill
          priority
          className="object-cover object-[70%_20%] md:object-[right_15%]"
          sizes="100vw"
        />

        <span
          className="absolute inset-y-0 left-0 w-full max-w-3xl bg-linear-to-r from-[#E2D1C3] via-[#E2D1C3]/90 to-transparent"
          aria-hidden
        />
        <span
          className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#E2D1C3]/60 to-transparent md:hidden"
          aria-hidden
        />
      </figure>

      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-8 lg:mx-0 lg:mr-auto lg:pl-10 xl:pl-14 2xl:pl-20">
        <article className="max-w-xl space-y-8 md:max-w-lg lg:max-w-xl">
          <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            Mi Promesa
          </span>
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-on-surface [text-shadow:0_0_24px_rgba(226,209,195,0.9)] md:text-5xl lg:text-[3rem]">
            Productos que inspiran tu día a día
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-on-surface/85 [text-shadow:0_0_16px_rgba(226,209,195,0.85)]">
            Distribuidora de marcas y productos para hogar, belleza, nutrición,
            bebidas y mucho más. Compra fácilmente con atención personalizada y
            entrega confiable.
          </p>
          <p>
            <Link
              href="/marcas"
              className="inline-block bg-on-surface px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
            >
              Explorar catálogo
            </Link>
          </p>
        </article>
      </header>
    </section>
  )
}
