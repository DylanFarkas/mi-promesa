import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, MessageCircle, Home } from 'lucide-react'
import { StoreSticker } from '@/components/store/StoreSticker'

export const metadata: Metadata = {
  title: 'Pedido confirmado',
}

interface Props {
  searchParams: Promise<{ order?: string }>
}

const STEPS = [
  {
    step: '01',
    title: 'Pedido registrado',
    desc: 'Tu pedido quedó guardado en nuestro sistema.',
    face: 'bg-primary text-white',
    back: 'bg-secondary',
    meta: 'text-white/65',
  },
  {
    step: '02',
    title: 'Te contactamos',
    desc: 'Te escribimos por WhatsApp para confirmar.',
    face: 'bg-sand text-ink',
    back: 'bg-primary',
    meta: 'text-ink/55',
  },
  {
    step: '03',
    title: 'Entrega',
    desc: 'Coordinamos el envío o recolección.',
    face: 'bg-secondary text-ink',
    back: 'bg-ink',
    meta: 'text-ink/60',
  },
] as const

export default async function ConfirmacionPage({ searchParams }: Props) {
  const { order } = await searchParams

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-6 md:py-20">
      <div className="mb-6 flex justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft shadow-card">
          <CheckCircle size={40} className="text-primary" />
          <span className="absolute -top-1 -right-2 text-xl text-secondary" aria-hidden>
            ✦
          </span>
        </div>
      </div>

      <h1 className="mb-3 font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-4xl font-bold tracking-tight text-ink">
        ¡Pedido <span className="store-squiggle text-primary">recibido</span>!
      </h1>

      {order && (
        <p className="mb-2 text-sm text-on-surface-variant">
          Número de orden:{' '}
          <span className="rounded-lg bg-surface px-2.5 py-1 font-mono font-bold text-ink">
            {order}
          </span>
        </p>
      )}

      <p className="mx-auto mt-4 max-w-md leading-relaxed text-on-surface-variant">
        Recibimos tu pedido correctamente. Nos pondremos en contacto contigo por WhatsApp para
        coordinar el pago y la entrega.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 text-left sm:grid-cols-3 sm:gap-4">
        {STEPS.map((s) => (
          <StoreSticker
            key={s.step}
            size="sm"
            shape="soft"
            back={s.back}
            face={s.face}
            faceClassName="min-h-[140px] p-5"
          >
            <span
              className={`font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-xs font-bold tracking-[0.22em] ${s.meta}`}
            >
              Paso {s.step}
            </span>
            <div className="mt-auto space-y-1.5 pt-6">
              <p className="text-sm font-bold">{s.title}</p>
              <p className={`text-xs leading-relaxed ${s.meta}`}>{s.desc}</p>
            </div>
          </StoreSticker>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="https://wa.me/521xxxxxxxxxx"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-store btn-store--primary"
        >
          <MessageCircle size={16} />
          Abrir WhatsApp
        </a>
        <Link href="/" className="btn-store btn-store--ghost">
          <Home size={16} />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
