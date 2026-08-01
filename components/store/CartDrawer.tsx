'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Minus, Plus, HelpCircle, Truck } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { formatCurrency } from '@/lib/utils'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQty, removeItem, subtotal } = useCartStore()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { overflow, paddingRight } = document.body.style
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (open) {
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [open])

  return (
    <>
      <div
        ref={overlayRef}
        onClick={onClose}
        className={[
          'fixed inset-0 z-90 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-500',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-label="Bolsa de compras"
        aria-modal="true"
        className={[
          'fixed top-0 right-0 z-100 flex h-full w-full flex-col bg-paper p-5 shadow-float transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:w-105 md:rounded-l-[1.75rem] md:p-7',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-xl font-bold tracking-tight text-ink">
              Tu carrito
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Revisa tus productos antes de finalizar
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
            aria-label="Cerrar carrito"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="hide-scrollbar grow space-y-5 overflow-y-auto">
          {items.length === 0 ? (
            <CartEmptyState onClose={onClose} />
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <CartLineItem
                  key={item.productId}
                  item={item}
                  onClose={onClose}
                  updateQty={updateQty}
                  removeItem={removeItem}
                />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && <CartDrawerFooter subtotal={subtotal()} onClose={onClose} />}
      </aside>
    </>
  )
}

function CartEmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-on-surface-variant">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-primary">
        <ShoppingBag size={28} strokeWidth={1.5} />
      </span>
      <p className="text-sm font-medium">Tu carrito está vacío</p>
      <button onClick={onClose} className="btn-store btn-store--primary">
        Seguir comprando
      </button>
    </div>
  )
}

function CartLineItem({
  item,
  onClose,
  updateQty,
  removeItem,
}: {
  item: ReturnType<typeof useCartStore.getState>['items'][number]
  onClose: () => void
  updateQty: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
}) {
  return (
    <li className="flex gap-3 rounded-2xl bg-white p-3 shadow-card">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag size={20} className="text-outline-variant" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="text-xs font-semibold text-primary">{item.brandName}</p>
          <Link
            href={`/productos/${item.brandSlug}/${item.productSlug}`}
            onClick={onClose}
            className="mt-0.5 block line-clamp-2 text-sm font-semibold text-ink transition-colors hover:text-primary"
          >
            {item.title}
          </Link>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center overflow-hidden rounded-full border border-outline-variant/70 bg-white">
            <button
              onClick={() => updateQty(item.productId, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-ink transition-colors hover:bg-surface"
              aria-label="Reducir cantidad"
            >
              <Minus size={12} />
            </button>
            <span className="w-6 text-center text-sm font-semibold tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.productId, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-ink transition-colors hover:bg-surface"
              aria-label="Aumentar cantidad"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-ink">
              {formatCurrency(item.price * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-xs font-medium text-on-surface-variant transition-colors hover:text-accent"
              aria-label="Eliminar producto"
            >
              Quitar
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

function CartDrawerFooter({
  subtotal,
  onClose,
}: {
  subtotal: number
  onClose: () => void
}) {
  return (
    <div className="mt-6 space-y-4 border-t border-outline-variant/40 pt-6">
      <div className="flex justify-between text-base">
        <span className="text-on-surface-variant">Total estimado</span>
        <span className="text-xl font-bold text-ink">{formatCurrency(subtotal)}</span>
      </div>
      <Link href="/checkout" onClick={onClose} className="btn-store btn-store--primary w-full">
        Ir al checkout
      </Link>
      <button
        onClick={onClose}
        className="w-full text-center text-sm font-medium text-on-surface-variant transition-colors hover:text-ink"
      >
        Seguir comprando
      </button>
      <div className="flex justify-center gap-6 pt-1">
        <Link
          href="/nosotros"
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:text-primary"
        >
          <HelpCircle size={14} />
          Ayuda
        </Link>
        <Link
          href="/nosotros"
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:text-primary"
        >
          <Truck size={14} />
          Envíos
        </Link>
      </div>
    </div>
  )
}
