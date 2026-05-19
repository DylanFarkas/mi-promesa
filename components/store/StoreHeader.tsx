'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { CartDrawer } from './CartDrawer'

export function StoreHeader() {
  const pathname = usePathname()
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { totalItems, hasHydrated } = useCartStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/marcas', label: 'Marcas' },
    { href: '/categorias', label: 'Categorías' },
    { href: '/nosotros', label: 'Nosotros' },
  ]

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <>
      <header
        className={[
          'sticky top-0 z-30 w-full transition-all duration-200',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100'
            : 'bg-white border-b border-stone-100',
        ].join(' ')}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 text-xl font-bold tracking-tight text-stone-900 hover:text-rose-600 transition-colors"
            >
              Mi Promesa
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-rose-600'
                      : 'text-stone-600 hover:text-stone-900',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link
                href="/buscar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 transition-colors"
                aria-label="Buscar"
              >
                <Search size={18} />
              </Link>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 transition-colors"
                aria-label="Abrir carrito"
              >
                <ShoppingBag size={18} />
                {hasHydrated && totalItems() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white leading-none">
                    {totalItems() > 9 ? '9+' : totalItems()}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 transition-colors md:hidden"
                aria-label="Menú"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-stone-100 bg-white px-4 pb-4 md:hidden">
            <nav className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-stone-700 hover:bg-stone-50',
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
