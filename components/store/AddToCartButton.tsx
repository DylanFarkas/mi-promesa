'use client'

import { useState, type MouseEvent } from 'react'
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

  function handleAddToCart(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

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
      type="button"
      onClick={handleAddToCart}
      className={[
        'flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 active:scale-95',
        added
          ? 'bg-mint-deep text-white shadow-md shadow-mint-deep/25'
          : 'bg-ink text-white shadow-md shadow-ink/20 hover:-translate-y-0.5 hover:bg-primary hover:shadow-lg hover:shadow-primary/30',
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
          Agregar al carrito
        </>
      )}
    </button>
  )
}
