import Link from 'next/link'
import { Star, Globe, MessageCircle } from 'lucide-react'

export function StoreFooter() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="text-xl font-bold text-white tracking-tight mb-3">Mi Promesa</p>
            <p className="text-sm leading-relaxed max-w-xs text-stone-400">
              Distribuidora de productos de belleza, bienestar y hogar. Calidad garantizada con atención personalizada.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-stone-400 hover:border-rose-500 hover:text-rose-400 transition-colors"
                aria-label="Instagram"
              >
                <Star size={16} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-stone-400 hover:border-rose-500 hover:text-rose-400 transition-colors"
                aria-label="Sitio web"
              >
                <Globe size={16} />
              </a>
              <a
                href="https://wa.me/521xxxxxxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-stone-400 hover:border-green-500 hover:text-green-400 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Tienda</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/marcas" className="hover:text-white transition-colors">Marcas</Link></li>
              <li><Link href="/categorias" className="hover:text-white transition-colors">Categorías</Link></li>
              <li><Link href="/buscar" className="hover:text-white transition-colors">Buscar</Link></li>
              <li><Link href="/checkout" className="hover:text-white transition-colors">Carrito</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Ayuda</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/nosotros" className="hover:text-white transition-colors">Nosotros</Link></li>
              <li>
                <a
                  href="https://wa.me/521xxxxxxxxxx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Contacto por WhatsApp
                </a>
              </li>
              <li><span className="text-stone-500 cursor-default">Política de privacidad</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Mi Promesa. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
