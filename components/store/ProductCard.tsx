import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Product, Brand, Category } from '@/types/database'
import { AddToCartButton } from './AddToCartButton'

export type ProductCardData = Pick<
  Product,
  'id' | 'name' | 'slug' | 'price' | 'compare_at_price' | 'primary_image_url' | 'short_description'
> & {
  brand: Pick<Brand, 'name' | 'slug'>
  category?: Pick<Category, 'name' | 'slug'> | null
}

interface ProductCardProps {
  product: ProductCardData
  variant?: 'default' | 'editorial'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const hasDiscount =
    product.compare_at_price !== null && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  const href = `/productos/${product.brand.slug}/${product.slug}`

  if (variant === 'editorial') {
    return (
      <article className="group cursor-pointer">
        <Link href={href} className="relative mb-6 block aspect-4/5 overflow-hidden bg-white">
          {product.primary_image_url ? (
            <Image
              src={product.primary_image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag size={32} className="text-zinc-300" />
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
              Oferta
            </span>
          )}
          <div className="absolute bottom-4 left-1/2 w-[80%] -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
            <AddToCartButton
              product={product}
              fullWidth
              className="rounded-none bg-white/90 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-900 backdrop-blur-sm hover:bg-white"
            />
          </div>
        </Link>
        {product.category && (
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            {product.category.name}
          </p>
        )}
        <Link href={href}>
          <h3 className="mb-1 text-base text-zinc-900 transition-colors group-hover:text-zinc-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-zinc-500">{formatCurrency(product.price)}</p>
      </article>
    )
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white transition-all duration-200 hover:border-stone-200 hover:shadow-lg">
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

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={`/marcas/${product.brand.slug}`}
          className="text-[11px] font-semibold uppercase tracking-widest text-rose-500 transition-colors hover:text-rose-600"
        >
          {product.brand.name}
        </Link>

        <Link href={href} className="group/title flex-1">
          <h3 className="line-clamp-2 text-sm leading-snug font-medium text-stone-800 transition-colors group-hover/title:text-rose-600">
            {product.name}
          </h3>
        </Link>

        {product.short_description && (
          <p className="line-clamp-1 text-xs text-stone-400">{product.short_description}</p>
        )}

        <div className="mt-1 flex items-center gap-2">
          <span className="text-base font-bold text-stone-900">{formatCurrency(product.price)}</span>
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
