import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function StoreFooter() {
  return (
    <footer className="mt-12 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-6 md:col-span-1">
            <span className="block font-[family-name:var(--font-noto-serif),Georgia,serif] text-xl font-light tracking-[0.3em] text-zinc-900">
              Mi Promesa
            </span>
            <p className="max-w-xs font-[family-name:var(--font-noto-serif),Georgia,serif] text-xs uppercase leading-relaxed tracking-widest text-zinc-400">
              Un destino para quienes valoran la calidad silenciosa y la excelencia curada.
            </p>
          </div>

          <div>
            <h5 className="mb-6 font-[family-name:var(--font-noto-serif),Georgia,serif] text-xs font-bold uppercase tracking-widest text-zinc-900">
              Tienda
            </h5>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/marcas"
                  className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-xs uppercase tracking-wide text-zinc-400 transition-colors hover:text-zinc-900"
                >
                  Marcas
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias"
                  className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-xs uppercase tracking-wide text-zinc-400 transition-colors hover:text-zinc-900"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="/buscar"
                  className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-xs uppercase tracking-wide text-zinc-400 transition-colors hover:text-zinc-900"
                >
                  Buscar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 font-[family-name:var(--font-noto-serif),Georgia,serif] text-xs font-bold uppercase tracking-widest text-zinc-900">
              Conectar
            </h5>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/nosotros"
                  className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-xs uppercase tracking-wide text-zinc-400 transition-colors hover:text-zinc-900"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/521xxxxxxxxxx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-xs uppercase tracking-wide text-zinc-400 transition-colors hover:text-zinc-900"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-xs font-bold uppercase tracking-widest text-zinc-900">
              Mantente curado
            </h5>
            <form className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <input
                type="email"
                placeholder="TU CORREO"
                className="w-full border-none bg-transparent p-0 text-[10px] tracking-widest text-zinc-600 placeholder:text-zinc-300 focus:ring-0 focus:outline-none"
                aria-label="Correo electrónico"
              />
              <button type="button" className="text-zinc-400" aria-label="Suscribirse">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-8 md:flex-row">
          <span className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-[10px] uppercase tracking-widest text-zinc-400">
            © {new Date().getFullYear()} Mi Promesa. Curated Excellence.
          </span>
          <div className="flex gap-6">
            <span className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-[10px] uppercase tracking-widest text-zinc-400">
              Privacidad
            </span>
            <span className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-[10px] uppercase tracking-widest text-zinc-400">
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
