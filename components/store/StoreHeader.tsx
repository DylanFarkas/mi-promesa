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

  const isOverlay = isHome && !scrolled && !mobileMenuOpen

  return (
    <>
      <header
        className={[
          'store-header fixed top-0 right-0 left-0 z-30 w-full border-b',
          hidden ? 'store-header--hidden' : 'store-header--visible',
          isOverlay
            ? 'border-transparent bg-transparent shadow-none'
            : 'border-outline-variant/40 bg-paper/90 shadow-sm backdrop-blur-md',
        ].join(' ')}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex h-16 items-center justify-between gap-4 md:h-20">
            <div className="flex items-center gap-8 md:gap-10">
              <Link
                href="/"
                className="shrink-0 font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-lg font-bold tracking-tight text-ink md:text-xl"
              >
                Mi <span className="text-primary">Promesa</span>
                <span className="ml-1 text-sm text-primary" aria-hidden>
                  ✦
                </span>
              </Link>

              <nav className="hidden items-center gap-1 md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      'rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200',
                      isActive(link.href)
                        ? 'bg-primary-soft text-primary'
                        : 'text-on-surface-variant hover:bg-ink/5 hover:text-ink',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href="/buscar"
                className={[
                  'hidden items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-300 lg:flex',
                  isOverlay
                    ? 'bg-white shadow-card hover:-translate-y-0.5 hover:shadow-lift'
                    : 'bg-surface hover:bg-white hover:shadow-card',
                ].join(' ')}
                aria-label="Buscar"
              >
                <Search size={16} className="text-primary" />
                <span className="text-sm text-on-surface-variant">Buscar productos...</span>
              </Link>

              <Link
                href="/buscar"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
                aria-label="Buscar"
              >
                <Search size={18} />
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-all hover:bg-ink/5 active:scale-95"
                aria-label="Abrir carrito"
              >
                <ShoppingBag size={18} />
                {hasHydrated && totalItems() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow-sm">
                    {totalItems() > 9 ? '9+' : totalItems()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
                aria-label="Menú"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-outline-variant/40 bg-paper px-5 pb-5 md:hidden">
            <nav className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-primary-soft text-primary'
                      : 'text-on-surface-variant hover:bg-surface hover:text-ink',
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
