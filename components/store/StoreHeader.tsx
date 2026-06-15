'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { CartDrawer } from './CartDrawer'

const SCROLL_THRESHOLD = 8

export function StoreHeader() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  const { totalItems, hasHydrated } = useCartStore()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastScrollY.current

      setScrolled(y > SCROLL_THRESHOLD)

      if (y <= SCROLL_THRESHOLD) {
        setHidden(false)
      } else if (delta > 2) {
        setHidden(true)
        setMobileMenuOpen(false)
      } else if (delta < -2) {
        setHidden(false)
      }

      lastScrollY.current = y
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/productos', label: 'Productos' },
    { href: '/marcas', label: 'Marcas' },
    { href: '/categorias', label: 'Categorías' },
    { href: '/#novedades', label: 'Novedades' },
    { href: '/nosotros', label: 'Nosotros' },
  ]

  const isActive = (href: string) => {
    if (href === '/#novedades') return pathname === '/'
    if (href === '/productos') return pathname === '/productos'
    return pathname.startsWith(href.replace('/#novedades', ''))
  }

  const isOverlay = isHome && !scrolled

  return (
    <>
      <header
        className={[
          'store-header fixed top-0 right-0 left-0 z-30 w-full border-b',
          hidden ? 'store-header--hidden' : 'store-header--visible',
          isOverlay
            ? 'border-transparent bg-transparent shadow-none'
            : 'border-zinc-100 bg-white/95 shadow-sm backdrop-blur-md',
        ].join(' ')}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex h-16 items-center justify-between gap-4 md:h-20">
            <div className="flex items-center gap-8 md:gap-12">
              <Link
                href="/"
                className="shrink-0 font-[family-name:var(--font-noto-serif),Georgia,serif] text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900 md:text-base"
              >
                Mi Promesa
              </Link>

              <nav className="hidden items-center gap-8 md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      'font-[family-name:var(--font-noto-serif),Georgia,serif] text-sm uppercase tracking-tight transition-colors duration-300',
                      isActive(link.href)
                        ? 'border-b-2 border-zinc-900 pb-1 text-zinc-900'
                        : 'text-zinc-500 hover:text-zinc-900',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <Link
                href="/buscar"
                className={[
                  'hidden items-center gap-2 rounded-full px-4 py-2 transition-all lg:flex',
                  isOverlay
                    ? 'bg-white/50 backdrop-blur-sm hover:bg-white/70'
                    : 'bg-white hover:bg-[#e8e8e8]',
                ].join(' ')}
                aria-label="Buscar"
              >
                <Search size={16} className="text-zinc-400" />
                <span className="text-sm text-zinc-400">Buscar...</span>
              </Link>

              <Link
                href="/buscar"
                className="flex h-9 w-9 items-center justify-center text-zinc-900 lg:hidden"
                aria-label="Buscar"
              >
                <Search size={18} />
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative flex h-9 w-9 items-center justify-center text-zinc-900 transition-transform active:scale-95"
                aria-label="Abrir carrito"
              >
                <ShoppingBag size={18} />
                {hasHydrated && totalItems() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-on-surface px-1 text-[10px] font-bold text-white">
                    {totalItems() > 9 ? '9+' : totalItems()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center text-zinc-900 md:hidden"
                aria-label="Menú"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-zinc-100 bg-white px-6 pb-4 md:hidden">
            <nav className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'rounded px-3 py-2.5 font-[family-name:var(--font-noto-serif),Georgia,serif] text-sm uppercase tracking-tight transition-colors',
                    isActive(link.href)
                      ? 'bg-surface-container-low text-zinc-900'
                      : 'text-zinc-600 hover:bg-surface',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
