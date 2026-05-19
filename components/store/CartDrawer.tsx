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
          'fixed inset-0 z-90 bg-black/30 backdrop-blur-[2px] transition-opacity duration-500',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-label="Bolsa de compras"
        aria-modal="true"
        className={[
          'fixed top-0 right-0 z-100 flex h-full w-full flex-col border-l border-outline-variant bg-white p-6 shadow-2xl transition-transform duration-500 ease-in-out md:w-[450px] md:p-8',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="mb-8 flex items-start justify-between">
          <div>
          <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-900">
            Bolsa de compras
          </h2>
          <p className="mt-1 font-serif text-sm text-on-surface-variant">
            Seleccionado exclusivamente para ti
          </p>
        </div>
          <button
            onClick={onClose}
            className="text-zinc-900 transition-transform duration-300 hover:rotate-90"
            aria-label="Cerrar carrito"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="hide-scrollbar grow space-y-8 overflow-y-auto">
          {items.length === 0 ? (
            <CartEmptyState onClose={onClose} />
          ) : (
            <ul className="space-y-8">
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

        {items.length > 0 && (
          <CartDrawerFooter subtotal={subtotal()} onClose={onClose} />
        )}
      </aside>
    </>
  )
}

function CartEmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-on-surface-variant">
      <ShoppingBag size={48} strokeWidth={1} />
      <p className="font-serif text-sm">Tu bolsa está vacía</p>
      <button
        onClick={onClose}
        className="border-b border-zinc-900 pb-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-900 transition-opacity hover:opacity-70"
      >
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
    <li className="flex gap-4">
      <div className="relative h-32 w-24 shrink-0 bg-surface-container">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover grayscale-20 transition-all duration-500 hover:grayscale-0"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag size={20} className="text-zinc-300" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
            {item.brandName}
          </p>
          <Link
            href={`/productos/${item.brandSlug}/${item.productSlug}`}
            onClick={onClose}
            className="mt-1 block line-clamp-2 font-semibold text-zinc-900 transition-colors hover:text-zinc-600"
          >
            {item.title}
          </Link>
          <p className="mt-1 text-sm text-on-surface-variant">Cant: {item.quantity}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQty(item.productId, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center border border-outline-variant text-zinc-700 transition-colors hover:border-zinc-900"
              aria-label="Reducir cantidad"
            >
              <Minus size={12} />
            </button>
            <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQty(item.productId, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center border border-outline-variant text-zinc-700 transition-colors hover:border-zinc-900"
              aria-label="Aumentar cantidad"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-900">
              {formatCurrency(item.price * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant transition-colors hover:text-zinc-900"
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
    <div className="mt-8 space-y-6 border-t border-zinc-200 pt-8">
      <div className="flex justify-between font-serif text-base">
        <span className="uppercase tracking-wide text-on-surface-variant">Total estimado</span>
        <span className="font-bold text-zinc-900">{formatCurrency(subtotal)}</span>
      </div>
      <Link
        href="/checkout"
        onClick={onClose}
        className="flex w-full items-center justify-center bg-zinc-900 py-4 text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-zinc-800"
      >
        Ir al checkout
      </Link>
      <button
        onClick={onClose}
        className="w-full text-center text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant transition-colors hover:text-zinc-900"
      >
        Seguir comprando
      </button>
      <div className="flex justify-center gap-8 pt-2">
        <Link
          href="/nosotros"
          onClick={onClose}
          className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <HelpCircle size={14} />
          Ayuda
        </Link>
        <Link
          href="/nosotros"
          onClick={onClose}
          className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <Truck size={14} />
          Envíos
        </Link>
      </div>
    </div>
  )
}

