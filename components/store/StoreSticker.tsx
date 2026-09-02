import Link from 'next/link'
import type { ReactNode } from 'react'

const SHAPE_CLASS = {
  a: 'store-sticker-a',
  b: 'store-sticker-b',
  c: 'store-sticker-c',
  soft: 'store-sticker-soft',
} as const

export type StoreStickerShape = keyof typeof SHAPE_CLASS
export type StoreStickerSize = 'sm' | 'lg'

type StoreStickerProps = {
  /** Clases de color para la capa offset (ej. bg-primary) */
  back: string
  /** Clases de color/texto para la cara (ej. bg-sand text-ink) */
  face: string
  shape?: StoreStickerShape
  size?: StoreStickerSize
  className?: string
  faceClassName?: string
  children: ReactNode
  href?: string
  external?: boolean
  onClick?: () => void
}

/**
 * Sticker reutilizable: capa de color offset + face.
 * size lg = BenefitsStrip; sm = confirmación / empty states.
 */
export function StoreSticker({
  back,
  face,
  shape = 'soft',
  size = 'sm',
  className = '',
  faceClassName = '',
  children,
  href,
  external,
  onClick,
}: StoreStickerProps) {
  const shapeClass = SHAPE_CLASS[shape]
  const sizeClass = size === 'sm' ? 'store-sticker--sm' : ''

  const faceClasses = [
    'store-sticker-face flex flex-col overflow-hidden',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30',
    shapeClass,
    face,
    faceClassName,
  ]
    .filter(Boolean)
    .join(' ')

  let faceNode: ReactNode

  if (href && external) {
    faceNode = (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={faceClasses}
        onClick={onClick}
      >
        {children}
      </a>
    )
  } else if (href) {
    faceNode = (
      <Link href={href} className={faceClasses} onClick={onClick}>
        {children}
      </Link>
    )
  } else if (onClick) {
    faceNode = (
      <button type="button" className={`${faceClasses} w-full text-left`} onClick={onClick}>
        {children}
      </button>
    )
  } else {
    faceNode = <div className={faceClasses}>{children}</div>
  }

  return (
    <div className={`group relative ${sizeClass} ${className}`.trim()}>
      <span className={`store-sticker-back ${shapeClass} ${back}`} aria-hidden />
      {faceNode}
    </div>
  )
}
