'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Minus, Plus } from 'lucide-react'
import { AddToCartButton } from './AddToCartButton'
import type { ProductCardData } from './ProductCard'

interface ProductActionsProps {
  product: ProductCardData
  whatsAppHref?: string
  variant?: 'default' | 'editorial'
}

export function ProductActions({
  product,
  whatsAppHref,
  variant = 'default',
}: ProductActionsProps) {
  const [qty, setQty] = useState(1)

  if (variant === 'editorial') {
    return (
      <section className="flex flex-col gap-8">
        <fieldset className="flex flex-col gap-4 border-0 p-0">
          <legend className="text-xs font-semibold uppercase tracking-widest text-on-surface">
            Cantidad
          </legend>
          <div className="flex w-fit items-center border border-outline-variant">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="p-4 text-on-surface transition-colors hover:bg-surface-container-low"
              aria-label="Disminuir cantidad"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-12 px-4 text-center text-xs font-semibold uppercase tracking-widest">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="p-4 text-on-surface transition-colors hover:bg-surface-container-low"
              aria-label="Aumentar cantidad"
            >
              <Plus size={14} />
            </button>
          </div>
        </fieldset>

        <div className="flex flex-col gap-4">
          <AddToCartButton
            product={product}
            quantity={qty}
            fullWidth
            className="rounded-sm! py-6 text-xs font-semibold uppercase tracking-[0.2em]"
          />
          {whatsAppHref && (
            <Link
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-sm border border-on-surface py-6 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface transition-colors hover:bg-surface-container-low"
            >
              <MessageCircle size={18} strokeWidth={1.5} />
              Pedir por WhatsApp
            </Link>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-500">Cantidad</span>
        <div className="flex items-center overflow-hidden rounded-full border border-stone-200">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center text-stone-600 transition-colors hover:bg-stone-50"
            aria-label="Disminuir"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-stone-800">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center text-stone-600 transition-colors hover:bg-stone-50"
            aria-label="Aumentar"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <AddToCartButton product={product} quantity={qty} fullWidth />
    </section>
  )
}
