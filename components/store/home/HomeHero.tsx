import Image from 'next/image'
import Link from 'next/link'

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCDeft0AcaBCbfheThd02Yy62ZWknaRKrIsKOry9qPc5knKw1zorsHCG1nYJmdAJ3gpjqOPZZIwFWkEjY6UD45BYvdXP-6jrZPHkZaSNOkukb9Snz9RNJ3pY0e_vDAte9vaBCwIZqbo2Njg3FdKneftzJDOPaY5kXKHqzJ00kFPstDDV9-E-6RrNJNFGlp7mknImr6pBSigiko_4Up-M8d1fyGq8p6Ao8RoBYQ0I5c0xH7-ZUhVAMRyhMIz4DsrunknkWVyt-G9CU4'

export function HomeHero() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-zinc-100 md:min-h-[85vh]">
      <figure className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt="Colección curada Mi Promesa"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <span className="absolute inset-0 bg-black/10" aria-hidden />
      </figure>

      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-8">
        <article className="max-w-xl space-y-8">
          <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            Colección curada
          </span>
          <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-on-surface md:text-5xl lg:text-[3rem]">
            La esencia de una vida con intención
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-on-surface-variant">
            Belleza, bienestar, nutrición y hogar. Marcas seleccionadas con la calidad que mereces,
            entregadas con atención personalizada.
          </p>
          <p>
            <Link
              href="/marcas"
              className="inline-block bg-on-surface px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
            >
              Explorar colección
            </Link>
          </p>
        </article>
      </header>
    </section>
  )
}
