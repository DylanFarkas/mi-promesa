'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import type { ProductCardData } from './ProductCard'

interface AddToCartButtonProps {
  product: ProductCardData
  quantity?: number
  className?: string
  fullWidth?: boolean
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  fullWidth = false,
}: AddToCartButtonProps) {
  const { addItem } = useCartStore()
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    addItem({
      productId: product.id,
      quantity,
      title: product.name,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      image: product.primary_image_url,
      brandName: product.brand.name,
      brandSlug: product.brand.slug,
      productSlug: product.slug,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <button
      onClick={handleAddToCart}
      className={[
        'flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200',
        added
          ? 'bg-green-500 text-white'
          : 'bg-stone-900 text-white hover:bg-rose-500',
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {added ? (
        <>
          <Check size={15} />
          Agregado
        </>
      ) : (
        <>
          <ShoppingBag size={15} />
          Agregar
        </>
      )}
    </button>
  )
}
