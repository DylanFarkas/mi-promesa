'use client'

import { useEffect, useRef, useState } from 'react'

const TICKER_ITEMS = [
  'Envío prioritario',
  'Productos 100% originales',
  'Atención por WhatsApp',
  'Salud · Hogar · Bienestar · Licores',
  'Nuevos productos cada semana',
] as const

/** Velocidad constante del scroll (px/s), independiente del ancho de pantalla. */
const SPEED_PX_PER_SEC = 48

function TickerSegment() {
  return (
    <>
      {TICKER_ITEMS.map((item) => (
        <span key={item} className="flex shrink-0 items-center gap-6">
          <span className="text-sm font-bold tracking-wide text-ink">{item}</span>
          <span className="text-ink/50" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </>
  )
}

export function HeroMarquee() {
  const containerRef = useRef<HTMLDivElement>(null)
  const segmentRef = useRef<HTMLDivElement>(null)
  const [copies, setCopies] = useState(4)
  const [durationSec, setDurationSec] = useState(26)

  useEffect(() => {
    const container = containerRef.current
    const segment = segmentRef.current
    if (!container || !segment) return

    const update = () => {
      const segmentWidth = segment.getBoundingClientRect().width
      const containerWidth = container.getBoundingClientRect().width
      if (segmentWidth < 1 || containerWidth < 1) return

      // Una mitad del track debe cubrir al menos el viewport (+1 de colchón)
      const needed = Math.ceil(containerWidth / segmentWidth) + 1
      const nextCopies = Math.max(2, needed)
      setCopies(nextCopies)
      setDurationSec(Math.max(12, (segmentWidth * nextCopies) / SPEED_PX_PER_SEC))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(container)
    ro.observe(segment)
    return () => ro.disconnect()
  }, [])

  // Dos mitades idénticas → translateX(-50%) hace loop sin saltos
  const total = copies * 2

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-secondary py-3">
      <div
        className="store-marquee flex w-max"
        style={{ ['--marquee-duration' as string]: `${durationSec}s` }}
      >
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? segmentRef : undefined}
            className="flex shrink-0 items-center gap-6 pr-6"
            aria-hidden={i > 0 ? true : undefined}
          >
            <TickerSegment />
          </div>
        ))}
      </div>
    </div>
  )
}
