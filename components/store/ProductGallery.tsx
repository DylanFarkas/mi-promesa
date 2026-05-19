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
        ? 'flex aspect-[4/5] items-center justify-center bg-[#eeeeee]'
        : 'flex aspect-square items-center justify-center rounded-2xl bg-stone-100'

    return (
      <figure className={emptyClass}>
        <ShoppingBag size={48} className="text-zinc-300" />
      </figure>
    )
  }

  if (variant === 'editorial') {
    const active = allImages[activeIndex]
    const secondary = allImages.filter((_, i) => i !== activeIndex).slice(0, 2)

    return (
      <figure className="grid grid-cols-2 gap-4">
        <div className="relative col-span-2 aspect-square overflow-hidden bg-white">
          <Image
            src={active.url}
            alt={active.alt_text ?? productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {secondary.map((img) => {
          const index = allImages.findIndex((i) => i.url === img.url)
          return (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="relative aspect-square overflow-hidden bg-white transition-opacity hover:opacity-90"
              aria-label={`Ver ${img.alt_text ?? 'imagen adicional'}`}
            >
              <Image
                src={img.url}
                alt={img.alt_text ?? productName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </button>
          )
        })}
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
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-50">
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
            </li>
          ))}
        </menu>
      )}
    </figure>
  )
}
