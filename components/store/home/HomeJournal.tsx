import Image from 'next/image'
import Link from 'next/link'

const JOURNAL_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDX7wEu7jw27VINmnpIT3sranTNIc0ZFQcck2dgGfN_I_QMJhs9-wxQwWahhkJ8LH8NLdV-DBJfQ90b5wNGMhN-eZeRREfEJR5SqirRHqNWbKt48Oep_NCYBkOuj2CppeuGWV1GyQHP7sGxgoTUdLMyuGk2p0HNPXIC3Fz0ivFtNi4I8A95GIZ6B6_lE9zTP7SAikgepSY2SDIsnfq8TufYYtDMzZ2LOukdIZHl4-tpGeE4Wyn3BCCSKuLuz-OjSH1_JQYuJ2QUE-I'

export function HomeJournal() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
          <div className="relative aspect-video w-full flex-1 overflow-hidden">
            <Image
              src={JOURNAL_IMAGE}
              alt="Variedad de productos disponibles en Mi Promesa"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex-1 space-y-4 md:space-y-6">
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Nuestra historia
            </span>
            <h2 className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-2xl text-on-surface md:text-[1.75rem]">
              Calidad y confianza en cada elección            </h2>
            <p className="text-base leading-relaxed text-on-surface-variant">
              En Mi Promesa distribuimos productos y marcas que aportan valor a tu día a día.
              Nuestro compromiso es ofrecer variedad, calidad y una atención cercana para que
              encuentres todo lo que necesitas en un solo lugar.
            </p>
            <Link
              href="/nosotros"
              className="inline-block border-b border-on-surface pb-1 pt-4 text-xs font-semibold uppercase tracking-widest text-on-surface transition-opacity hover:opacity-70"
            >
              Conocer más
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

