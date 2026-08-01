import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, MessageCircle, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pedido confirmado',
}

interface Props {
  searchParams: Promise<{ order?: string }>
}

export default async function ConfirmacionPage({ searchParams }: Props) {
  const { order } = await searchParams

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-6 md:py-20">
      <div className="mb-6 flex justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft shadow-card">
          <CheckCircle size={40} className="text-primary" />
          <span
            className="absolute -top-1 -right-2 text-xl text-secondary"
            aria-hidden
          >
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

      <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {[
          {
            step: '1',
            title: 'Pedido registrado',
            desc: 'Tu pedido quedó guardado en nuestro sistema.',
            done: true,
          },
          {
            step: '2',
            title: 'Te contactamos',
            desc: 'Te escribimos por WhatsApp para confirmar.',
            done: false,
          },
          {
            step: '3',
            title: 'Entrega',
            desc: 'Coordinamos el envío o recolección.',
            done: false,
          },
        ].map((s) => (
          <div
            key={s.step}
            className={[
              'rounded-2xl p-5 shadow-card',
              s.done ? 'bg-primary-soft/60' : 'bg-white',
            ].join(' ')}
          >
            <div
              className={[
                'mb-2 text-xs font-bold tracking-[0.18em] uppercase',
                s.done ? 'text-primary' : 'text-on-surface-variant',
              ].join(' ')}
            >
              Paso {s.step}
            </div>
            <p className="text-sm font-semibold text-ink">{s.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{s.desc}</p>
          </div>
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
