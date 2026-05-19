'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { AddToCartButton } from './AddToCartButton'
import type { ProductCardData } from './ProductCard'

interface ProductActionsProps {
  product: ProductCardData
}

export function ProductActions({ product }: ProductActionsProps) {
  const [qty, setQty] = useState(1)

  return (
    <div className="flex flex-col gap-4">
      {/* Qty selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-500">Cantidad</span>
        <div className="flex items-center border border-stone-200 rounded-full overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
            aria-label="Disminuir"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-stone-800">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
            aria-label="Aumentar"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <AddToCartButton product={product} quantity={qty} fullWidth />
    </div>
  )
}
