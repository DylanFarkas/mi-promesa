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
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle size={40} className="text-green-500" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-stone-900 mb-3">¡Pedido recibido!</h1>

      {order && (
        <p className="text-sm text-stone-500 mb-2">
          Número de orden:{' '}
          <span className="font-mono font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md">
            {order}
          </span>
        </p>
      )}

      <p className="text-stone-500 leading-relaxed mt-4 max-w-md mx-auto">
        Recibimos tu pedido correctamente. Nos pondremos en contacto contigo por WhatsApp
        para coordinar el pago y la entrega.
      </p>

      {/* Steps */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
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
              'rounded-2xl border p-4',
              s.done
                ? 'border-green-200 bg-green-50'
                : 'border-stone-100 bg-stone-50',
            ].join(' ')}
          >
            <div className={[
              'text-xs font-bold mb-2',
              s.done ? 'text-green-600' : 'text-stone-400',
            ].join(' ')}>
              Paso {s.step}
            </div>
            <p className="text-sm font-semibold text-stone-800">{s.title}</p>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
        <a
          href="https://wa.me/521xxxxxxxxxx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
        >
          <MessageCircle size={16} />
          Abrir WhatsApp
        </a>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-6 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <Home size={16} />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
