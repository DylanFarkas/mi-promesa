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
      <section className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3 border-0 p-0">
          <legend className="text-xs font-bold tracking-[0.18em] text-on-surface-variant uppercase">
            Cantidad
          </legend>
          <div className="flex w-fit items-center overflow-hidden rounded-full bg-white shadow-card">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="p-3.5 text-ink transition-colors hover:bg-surface"
              aria-label="Disminuir cantidad"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-10 px-3 text-center text-sm font-bold tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="p-3.5 text-ink transition-colors hover:bg-surface"
              aria-label="Aumentar cantidad"
            >
              <Plus size={14} />
            </button>
          </div>
        </fieldset>

        <div className="flex flex-col gap-3">
          <AddToCartButton
            product={product}
            quantity={qty}
            fullWidth
            className="rounded-full! py-4 text-sm font-semibold"
          />
          {whatsAppHref && (
            <Link
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-mint py-4 text-sm font-bold text-mint-deep transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-mint-deep/20"
            >
              <MessageCircle size={18} strokeWidth={2} />
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
        <span className="text-sm text-on-surface-variant">Cantidad</span>
        <div className="flex items-center overflow-hidden rounded-full border border-outline-variant">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-surface"
            aria-label="Disminuir"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-ink">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-surface"
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
