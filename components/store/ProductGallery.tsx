'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  url: string
  alt_text: string | null
}

interface ProductGalleryProps {
  mainImage: string | null
  images: GalleryImage[]
  productName: string
}

export function ProductGallery({ mainImage, images, productName }: ProductGalleryProps) {
  const allImages: GalleryImage[] = [
    ...(mainImage ? [{ url: mainImage, alt_text: productName }] : []),
    ...images,
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  if (allImages.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-stone-100 flex items-center justify-center">
        <ShoppingBag size={48} className="text-stone-300" />
      </div>
    )
  }

  const active = allImages[activeIndex]

  function prev() {
    setActiveIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))
  }

  function next() {
    setActiveIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-50">
        <Image
          src={active.url}
          alt={active.alt_text ?? productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-stone-600 shadow-sm hover:bg-white transition-colors backdrop-blur-sm"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-stone-600 shadow-sm hover:bg-white transition-colors backdrop-blur-sm"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={16} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={[
                    'rounded-full transition-all',
                    i === activeIndex
                      ? 'bg-white w-4 h-1.5'
                      : 'bg-white/60 w-1.5 h-1.5',
                  ].join(' ')}
                  aria-label={`Ir a imagen ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={[
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                i === activeIndex
                  ? 'border-rose-500'
                  : 'border-transparent hover:border-stone-200',
              ].join(' ')}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt_text ?? `Imagen ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
