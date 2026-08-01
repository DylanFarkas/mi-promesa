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
  /** Muestra badge "Nuevo" (p. ej. en la sección de novedades). */
  showNewBadge?: boolean
}

/** Stickers de estado con leve rotación: detalle de marca propio. */
function CardBadges({ hasDiscount, discountPct, showNewBadge }: {
  hasDiscount: boolean
  discountPct: number
  showNewBadge: boolean
}) {
  if (!hasDiscount && !showNewBadge) return null
  return (
    <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
      {hasDiscount && (
        <span className="-rotate-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-white shadow-md shadow-accent/30">
          -{discountPct}%
        </span>
      )}
      {showNewBadge && (
        <span className="rotate-2 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-ink shadow-md shadow-secondary/40">
          ✦ Nuevo
        </span>
      )}
    </div>
  )
}

export function ProductCard({
  product,
  variant = 'default',
  showNewBadge = false,
}: ProductCardProps) {
  const hasDiscount =
    product.compare_at_price !== null && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  const href = `/productos/${product.brand.slug}/${product.slug}`

  if (variant === 'editorial') {
    return (
      <article className="group flex h-full flex-col rounded-3xl bg-white p-2 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
        <div className="relative flex-1 overflow-hidden rounded-[1.15rem] bg-surface">
          <Link href={href} className="relative block h-full">
            <div className="relative aspect-4/5 h-full w-full">
              {product.primary_image_url ? (
                <Image
                  src={product.primary_image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag size={32} className="text-outline-variant" />
                </div>
              )}
            </div>

            <CardBadges
              hasDiscount={hasDiscount}
              discountPct={discountPct}
              showNewBadge={showNewBadge}
            />
          </Link>

          <div className="absolute inset-x-3 bottom-3 z-10 translate-y-1 opacity-100 transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <AddToCartButton
              product={product}
              fullWidth
              className="rounded-full bg-ink/90 py-3 text-xs font-bold text-white shadow-float backdrop-blur-sm hover:bg-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 p-4 pt-3.5">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/marcas/${product.brand.slug}`}
              className="truncate text-[11px] font-bold tracking-wide text-primary uppercase transition-colors hover:text-primary-deep"
            >
              {product.brand.name}
            </Link>
            {product.category && (
              <span className="truncate text-[11px] text-on-surface-variant">
                {product.category.name}
              </span>
            )}
          </div>

          <Link href={href}>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-primary md:text-[15px]">
              {product.name}
            </h3>
          </Link>

          <div className="mt-auto flex items-baseline gap-2 pt-1">
            <span className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-base font-bold text-ink">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-on-surface-variant line-through">
                {formatCurrency(product.compare_at_price!)}
              </span>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className="group flex h-full flex-col rounded-3xl bg-white p-2 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
      <Link href={href} className="relative block overflow-hidden rounded-[1.15rem] bg-surface">
        <div className="relative aspect-square w-full">
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
              <ShoppingBag size={32} className="text-outline-variant" />
            </div>
          )}
        </div>

        <CardBadges
          hasDiscount={hasDiscount}
          discountPct={discountPct}
          showNewBadge={showNewBadge}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4 pt-3.5">
        <Link
          href={`/marcas/${product.brand.slug}`}
          className="text-[11px] font-bold uppercase tracking-wide text-primary transition-colors hover:text-primary-deep"
        >
          {product.brand.name}
        </Link>

        <Link href={href} className="group/title flex-1">
          <h3 className="line-clamp-2 text-sm leading-snug font-medium text-ink transition-colors group-hover/title:text-primary">
            {product.name}
          </h3>
        </Link>

        {product.short_description && (
          <p className="line-clamp-1 text-xs text-on-surface-variant">{product.short_description}</p>
        )}

        <div className="mt-1 flex items-center gap-2">
          <span className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-base font-bold text-ink">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-on-surface-variant line-through">
              {formatCurrency(product.compare_at_price!)}
            </span>
          )}
        </div>

        <AddToCartButton product={product} />
      </div>
    </div>
  )
}
