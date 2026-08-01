import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

const shopLinks = [
  { href: '/productos', label: 'Productos' },
  { href: '/marcas', label: 'Marcas' },
  { href: '/categorias', label: 'Categorías' },
  { href: '/buscar', label: 'Buscar' },
]

const infoLinks = [
  { href: '/nosotros', label: 'Nosotros' },
  { href: 'https://wa.me/521xxxxxxxxxx', label: 'WhatsApp', external: true },
]

function FooterLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  const className =
    'text-sm text-ink/70 transition-colors duration-200 hover:text-primary'

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

export function StoreFooter() {
  return (
    <footer className="mt-24 border-t border-ink/8 bg-white text-ink">
      <div className="mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Newsletter */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-4">
            <h3 className="text-xs font-bold tracking-[0.18em] text-ink uppercase">
              Recibe novedades
            </h3>
            <p className="max-w-xs text-sm leading-relaxed text-ink/55">
              Ofertas, lanzamientos y tips para tu día a día.
            </p>
            <form className="max-w-sm space-y-4">
              <label className="block">
                <span className="sr-only">Correo electrónico</span>
                <input
                  type="email"
                  placeholder="Tu correo..."
                  className="w-full border-0 border-b border-ink/25 bg-transparent px-0 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-primary focus:ring-0 focus:outline-none"
                />
              </label>
              <button
                type="button"
                className="rounded-full bg-ink px-6 py-2.5 text-xs font-bold tracking-[0.14em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-md hover:shadow-primary/25 active:scale-95"
              >
                Suscribirme
              </button>
            </form>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://wa.me/521xxxxxxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="mb-5 text-xs font-bold tracking-[0.18em] text-ink uppercase">
              Tienda
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-xs font-bold tracking-[0.18em] text-ink uppercase">
              Info
            </h3>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink {...link} />
                </li>
              ))}
              <li>
                <span className="text-sm text-ink/40">Privacidad</span>
              </li>
              <li>
                <span className="text-sm text-ink/40">Cookies</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="lg:col-span-3">
            <h3 className="mb-5 text-xs font-bold tracking-[0.18em] text-ink uppercase">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li>
                <p className="text-sm text-ink/70">
                  WhatsApp:{' '}
                  <a
                    href="https://wa.me/521xxxxxxxxxx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                  >
                    Escríbenos
                  </a>
                </p>
              </li>
              <li>
                <p className="text-sm leading-relaxed text-ink/55">
                  Productos médicos, bienestar, hogar y más. Todo en un solo lugar.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center">
          <span className="text-xs text-ink/45">
            © {new Date().getFullYear()} Mi Promesa
          </span>
          <span className="text-xs tracking-wide text-ink/40 uppercase">
            Todo en un solo lugar
          </span>
        </div>
      </div>

      {/* Wordmark gigante: escala al ancho del contenedor, sin recortes */}
      <div className="mt-4 w-full pb-4 md:mt-6 md:pb-5" aria-hidden>
        <div
          className="mx-auto w-full px-1.5 md:px-2"
          style={{ containerType: 'inline-size' }}
        >
          <p
            className="pointer-events-none select-none text-center font-[family-name:var(--font-store-display-face),system-ui,sans-serif] font-bold tracking-tighter whitespace-nowrap text-ink uppercase"
            style={{
              fontSize: 'min(calc(100cqi / 5.55), 22rem)',
              lineHeight: 0.88,
              paddingBottom: '0.08em',
            }}
          >
            Mi Promesa
          </p>
        </div>
      </div>
    </footer>
  )
}
