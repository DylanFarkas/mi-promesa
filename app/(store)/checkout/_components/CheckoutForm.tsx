'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { formatCurrency } from '@/lib/utils'

interface FormState {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  customerNotes: string
}

const INITIAL_FORM: FormState = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingAddress: '',
  customerNotes: '',
}

export function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal, clear, hasHydrated } = useCartStore()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (items.length === 0) {
      setError('Tu carrito está vacío.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Ocurrió un error. Inténtalo de nuevo.')
        return
      }

      clear()
      router.push(`/checkout/confirmacion?order=${data.orderNumber}`)
    } catch {
      setError('Error de conexión. Verifica tu internet e inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-rose-500" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-stone-400">
        <ShoppingBag size={48} strokeWidth={1} />
        <p className="text-base font-medium">Tu carrito está vacío</p>
        <Link
          href="/marcas"
          className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft size={14} />
          Explorar productos
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
      {/* Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <fieldset className="rounded-2xl border border-stone-100 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-stone-800 px-0.5">
            Tus datos de contacto
          </legend>

          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-stone-700 mb-1">
              Nombre completo <span className="text-rose-500">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              value={form.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              required
              minLength={2}
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-stone-700 mb-1">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="customerEmail"
                type="email"
                value={form.customerEmail}
                onChange={(e) => handleChange('customerEmail', e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-stone-700 mb-1">
                Teléfono / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                id="customerPhone"
                type="tel"
                value={form.customerPhone}
                onChange={(e) => handleChange('customerPhone', e.target.value)}
                required
                placeholder="+52 1 55 0000 0000"
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-colors"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-stone-100 bg-white p-6 space-y-4">
          <legend className="text-sm font-semibold text-stone-800 px-0.5">
            Entrega y notas (opcionales)
          </legend>

          <div>
            <label htmlFor="shippingAddress" className="block text-sm font-medium text-stone-700 mb-1">
              Dirección de entrega
            </label>
            <textarea
              id="shippingAddress"
              value={form.shippingAddress}
              onChange={(e) => handleChange('shippingAddress', e.target.value)}
              rows={2}
              placeholder="Calle, número, colonia, ciudad..."
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-colors resize-none"
            />
          </div>

          <div>
            <label htmlFor="customerNotes" className="block text-sm font-medium text-stone-700 mb-1">
              Notas adicionales
            </label>
            <textarea
              id="customerNotes"
              value={form.customerNotes}
              onChange={(e) => handleChange('customerNotes', e.target.value)}
              rows={2}
              placeholder="Instrucciones especiales, horario de entrega, etc."
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-colors resize-none"
            />
          </div>
        </fieldset>

        <p className="text-xs text-stone-400 leading-relaxed">
          Al confirmar tu pedido, recibirás un número de orden. Nos comunicaremos contigo
          por WhatsApp para coordinar el pago y la entrega.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-4 text-sm font-semibold text-white hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Enviando pedido...
            </>
          ) : (
            'Confirmar pedido'
          )}
        </button>
      </form>

      {/* Order summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-2xl border border-stone-100 bg-white p-6">
          <h2 className="text-sm font-semibold text-stone-800 mb-4">Resumen de tu pedido</h2>

          <ul className="divide-y divide-stone-50 space-y-0">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 py-3">
                {/* Image */}
                <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-stone-50">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag size={16} className="text-stone-300" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <p className="text-xs font-semibold text-rose-500 truncate">{item.brandName}</p>
                  <p className="text-sm text-stone-700 line-clamp-2 leading-snug">{item.title}</p>
                  <p className="text-xs text-stone-400">×{item.quantity}</p>
                </div>

                <p className="text-sm font-semibold text-stone-800 flex-shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="border-t border-stone-100 mt-3 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span className="font-semibold text-stone-900">{formatCurrency(subtotal())}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Envío</span>
              <span>A coordinar</span>
            </div>
          </div>

          <div className="border-t border-stone-100 mt-3 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-800">Total estimado</span>
              <span className="text-lg font-bold text-stone-900">{formatCurrency(subtotal())}</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
            <p className="text-xs text-amber-700 leading-relaxed">
              El pago se coordina por WhatsApp. No se realiza ningún cargo automático.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
