import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Brand } from '@/types/database'

type BrandCardData = Pick<Brand, 'name' | 'slug' | 'description'>

interface BrandCardProps {
  brand: BrandCardData
  productCount?: number
}

export function BrandCard({ brand, productCount }: BrandCardProps) {
  return (
    <Link
      href={`/marcas/${brand.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-stone-100 bg-white p-6 hover:border-rose-200 hover:shadow-md transition-all duration-200 min-h-[160px]"
    >
      <div>
        <h3 className="text-lg font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
          {brand.name}
        </h3>
        {brand.description && (
          <p className="mt-1.5 text-sm text-stone-400 line-clamp-2 leading-relaxed">
            {brand.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        {productCount !== undefined ? (
          <span className="text-xs text-stone-400">
            {productCount} {productCount === 1 ? 'producto' : 'productos'}
          </span>
        ) : (
          <span />
        )}
        <span className="flex items-center gap-1 text-xs font-semibold text-rose-500 group-hover:gap-2 transition-all">
          Ver productos
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}
