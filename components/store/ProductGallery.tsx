'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'

interface GalleryImage {
  url: string
  alt_text: string | null
}

interface ProductGalleryProps {
  mainImage: string | null
  images: GalleryImage[]
  productName: string
  variant?: 'default' | 'editorial'
}

export function ProductGallery({
  mainImage,
  images,
  productName,
  variant = 'default',
}: ProductGalleryProps) {
  const allImages: GalleryImage[] = [
    ...(mainImage ? [{ url: mainImage, alt_text: productName }] : []),
    ...images,
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  if (allImages.length === 0) {
    const emptyClass =
      variant === 'editorial'
        ? 'flex aspect-4/5 items-center justify-center rounded-3xl bg-surface'
        : 'flex aspect-square items-center justify-center rounded-2xl bg-surface'

    return (
      <figure className={emptyClass}>
        <ShoppingBag size={48} className="text-outline-variant" />
      </figure>
    )
  }

  if (variant === 'editorial') {
    const active = allImages[activeIndex]

    return (
      <figure className="flex flex-col gap-4">
        <div className="relative aspect-square overflow-hidden rounded-4xl bg-white shadow-card">
          <Image
            src={active.url}
            alt={active.alt_text ?? productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {allImages.length > 1 && (
          <menu className="flex gap-2.5 overflow-x-auto p-1 pb-2">
            {allImages.map((img, i) => (
              <li key={`${img.url}-${i}`} className="list-none">
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={[
                    'relative h-16 w-16 shrink-0 overflow-hidden rounded-xl transition-all duration-300',
                    i === activeIndex
                      ? 'shadow-card ring-2 ring-primary ring-offset-2 ring-offset-paper'
                      : 'opacity-70 hover:-translate-y-0.5 hover:opacity-100 hover:shadow-card',
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
              </li>
            ))}
          </menu>
        )}
      </figure>
    )
  }

  return (
    <DefaultGallery
      allImages={allImages}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      productName={productName}
    />
  )
}

function DefaultGallery({
  allImages,
  activeIndex,
  setActiveIndex,
  productName,
}: {
  allImages: GalleryImage[]
  activeIndex: number
  setActiveIndex: (i: number) => void
  productName: string
}) {
  const active = allImages[activeIndex]

  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
        <Image
          src={active.url}
          alt={active.alt_text ?? productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {allImages.length > 1 && (
        <menu className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <li key={i} className="list-none">
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                className={[
                  'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                  i === activeIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-outline-variant',
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
            </li>
          ))}
        </menu>
      )}
    </figure>
  )
}
