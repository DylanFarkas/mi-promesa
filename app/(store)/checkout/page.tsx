import type { Metadata } from 'next'
import { CheckoutForm } from './_components/CheckoutForm'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Completa tu pedido. Lo coordinamos por WhatsApp.',
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <CheckoutForm />
    </div>
  )
}
