import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Product, Brand } from '@/types/database'
import { AddToCartButton } from './AddToCartButton'

export type ProductCardData = Pick<
  Product,
  'id' | 'name' | 'slug' | 'price' | 'compare_at_price' | 'primary_image_url' | 'short_description'
> & {
  brand: Pick<Brand, 'name' | 'slug'>
}

interface ProductCardProps {
  product: ProductCardData
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.compare_at_price !== null && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  const href = `/productos/${product.brand.slug}/${product.slug}`

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-stone-200 hover:shadow-lg transition-all duration-200">
      {/* Image */}
      <Link href={href} className="relative block aspect-square overflow-hidden bg-stone-50">
        {product.primary_image_url ? (
          <Image
            src={product.primary_image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag size={32} className="text-stone-200" />
          </div>
        )}

        {hasDiscount && (
          <span className="absolute top-2 left-2 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white">
            -{discountPct}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link
          href={`/marcas/${product.brand.slug}`}
          className="text-[11px] font-semibold uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
        >
          {product.brand.name}
        </Link>

        <Link href={href} className="group/title flex-1">
          <h3 className="text-sm font-medium text-stone-800 group-hover/title:text-rose-600 line-clamp-2 leading-snug transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.short_description && (
          <p className="text-xs text-stone-400 line-clamp-1">{product.short_description}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-bold text-stone-900">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-stone-400 line-through">
              {formatCurrency(product.compare_at_price!)}
            </span>
          )}
        </div>

        <AddToCartButton product={product} />
      </div>
    </div>
  )
}
