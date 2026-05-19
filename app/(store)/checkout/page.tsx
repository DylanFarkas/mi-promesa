import type { Metadata } from 'next'
import { CheckoutForm } from './_components/CheckoutForm'

export const metadata: Metadata = {
  title: 'Finalizar pedido',
  description: 'Completa tu pedido. Lo coordinamos por WhatsApp.',
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-1">
          Último paso
        </p>
        <h1 className="text-3xl font-bold text-stone-900">Finalizar pedido</h1>
        <p className="mt-2 text-stone-500 text-sm">
          Completa tus datos y nos pondremos en contacto por WhatsApp para coordinar el pago y la entrega.
        </p>
      </div>

      <CheckoutForm />
    </div>
  )
}
