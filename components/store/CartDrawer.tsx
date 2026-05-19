'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react'
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
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className={[
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Carrito de compras"
        className={[
          'fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl',
          'flex flex-col transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-rose-500" />
            <span className="font-semibold text-stone-900">
              Mi carrito
              {items.length > 0 && (
                <span className="ml-2 text-sm font-normal text-stone-400">
                  ({items.length} {items.length === 1 ? 'producto' : 'productos'})
                </span>
              )}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-400">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-sm">Tu carrito está vacío</p>
              <button
                onClick={onClose}
                className="text-sm text-rose-500 hover:text-rose-600 underline underline-offset-2"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100 space-y-1">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-4">
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-stone-50">
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
                        <ShoppingBag size={20} className="text-stone-300" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="text-xs text-rose-500 font-medium uppercase tracking-wide truncate">
                      {item.brandName}
                    </p>
                    <Link
                      href={`/productos/${item.brandSlug}/${item.productSlug}`}
                      onClick={onClose}
                      className="text-sm font-medium text-stone-800 hover:text-rose-600 line-clamp-2 leading-snug"
                    >
                      {item.title}
                    </Link>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Qty controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.productId, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:border-rose-300 hover:text-rose-500 transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-stone-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:border-rose-300 hover:text-rose-500 transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-stone-300 hover:text-red-400 transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span className="font-semibold text-stone-900 text-base">
                {formatCurrency(subtotal())}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              El pago se coordina por WhatsApp. Al continuar, recibirás los datos de contacto.
            </p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3.5 text-sm font-semibold text-white hover:bg-rose-600 transition-colors"
            >
              Finalizar pedido
            </Link>
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
