'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, Loader2, Truck, Send } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { formatCurrency } from '@/lib/utils'

interface FormState {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingStreet: string
  shippingCity: string
  shippingPostalCode: string
  shippingCountry: string
  customerNotes: string
}

const INITIAL_FORM: FormState = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingStreet: '',
  shippingCity: '',
  shippingPostalCode: '',
  shippingCountry: 'México',
  customerNotes: '',
}

function buildShippingAddress(form: FormState): string | undefined {
  const parts = [
    form.shippingStreet.trim(),
    form.shippingCity.trim(),
    form.shippingPostalCode.trim(),
    form.shippingCountry.trim(),
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : undefined
}

function CheckoutField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  className,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant"
      >
        {label}
        {required && <span className="text-zinc-900"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-2 text-base text-on-surface transition-colors placeholder:text-on-surface-variant/60 focus:border-zinc-900 focus:outline-none focus:ring-0"
      />
    </div>
  )
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
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          shippingAddress: buildShippingAddress(form),
          customerNotes: form.customerNotes || undefined,
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
        <Loader2 size={24} className="animate-spin text-zinc-900" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-on-surface-variant">
        <ShoppingBag size={48} strokeWidth={1} />
        <p className="font-serif text-base">Tu bolsa está vacía</p>
        <Link
          href="/marcas"
          className="flex items-center gap-2 border-b border-zinc-900 pb-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-900 transition-opacity hover:opacity-70"
        >
          <ArrowLeft size={14} />
          Explorar productos
        </Link>
      </div>
    )
  }

  const total = subtotal()

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
        {/* Form column */}
        <div className="lg:col-span-7">
          <header className="mb-12">
            <h1 className="font-serif text-3xl text-on-surface md:text-4xl">Checkout</h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-on-surface-variant">
              Completa tus datos para finalizar tu pedido. Tu información se compartirá con el
              artesano vía WhatsApp.
            </p>
          </header>

          {error && (
            <div className="mb-8 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <section className="space-y-12">
            <div className="space-y-8">
              <h2 className="border-b border-outline-variant pb-2 font-serif text-2xl text-on-surface">
                Datos de entrega
              </h2>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <CheckoutField
                  id="customerName"
                  label="Nombre completo"
                  value={form.customerName}
                  onChange={(v) => handleChange('customerName', v)}
                  placeholder="Elena Rodríguez"
                  required
                />
                <CheckoutField
                  id="customerPhone"
                  label="Teléfono (WhatsApp)"
                  type="tel"
                  value={form.customerPhone}
                  onChange={(v) => handleChange('customerPhone', v)}
                  placeholder="+52 1 55 0000 0000"
                  required
                />
              </div>

              <CheckoutField
                id="customerEmail"
                label="Email"
                type="email"
                value={form.customerEmail}
                onChange={(v) => handleChange('customerEmail', v)}
                placeholder="tu@email.com"
                required
              />

              <CheckoutField
                id="shippingStreet"
                label="Dirección de envío"
                value={form.shippingStreet}
                onChange={(v) => handleChange('shippingStreet', v)}
                placeholder="Calle de la Luna, 42. 4B"
              />

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <CheckoutField
                  id="shippingCity"
                  label="Ciudad"
                  value={form.shippingCity}
                  onChange={(v) => handleChange('shippingCity', v)}
                  placeholder="Ciudad de México"
                />
                <CheckoutField
                  id="shippingPostalCode"
                  label="Código postal"
                  value={form.shippingPostalCode}
                  onChange={(v) => handleChange('shippingPostalCode', v)}
                  placeholder="06600"
                />
                <CheckoutField
                  id="shippingCountry"
                  label="País"
                  value={form.shippingCountry}
                  onChange={(v) => handleChange('shippingCountry', v)}
                  placeholder="México"
                />
              </div>

              <div>
                <label
                  htmlFor="customerNotes"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant"
                >
                  Notas adicionales
                </label>
                <textarea
                  id="customerNotes"
                  value={form.customerNotes}
                  onChange={(e) => handleChange('customerNotes', e.target.value)}
                  rows={2}
                  placeholder="Instrucciones especiales, horario de entrega..."
                  className="w-full resize-none border-0 border-b border-outline-variant bg-transparent px-0 py-2 text-base text-on-surface transition-colors placeholder:text-on-surface-variant/60 focus:border-zinc-900 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="border-b border-outline-variant pb-2 font-serif text-2xl text-on-surface">
                Método de envío
              </h2>
              <div className="flex cursor-pointer items-center justify-between border border-zinc-900 bg-white p-4 transition-all hover:shadow-sm">
                <div className="flex items-center gap-4">
                  <Truck size={22} className="text-zinc-900" strokeWidth={1.5} />
                  <div>
                    <p className="font-semibold text-on-surface">Envío estándar boutique</p>
                    <p className="text-sm text-on-surface-variant">3–5 días hábiles</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-on-surface-variant">A coordinar</span>
              </div>
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="lg:col-span-5">
          <div className="sticky top-28 space-y-8 border border-outline-variant bg-surface-container-low p-6 shadow-sm md:p-8">
            <h2 className="font-serif text-xl text-on-surface md:text-2xl">Resumen del pedido</h2>

            <ul className="hide-scrollbar max-h-[400px] space-y-6 overflow-y-auto pr-2">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <div className="relative h-32 w-24 shrink-0 bg-surface-container">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover grayscale-20 transition-all duration-500 hover:grayscale-0"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag size={20} className="text-zinc-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 grow flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-zinc-900">{item.title}</h4>
                      <p className="text-sm text-on-surface-variant">{item.brandName}</p>
                      <p className="text-sm text-on-surface-variant">Cant: {item.quantity}</p>
                    </div>
                    <p className="self-end font-semibold text-zinc-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-outline-variant pt-6">
              <CheckoutTotals subtotal={total} />
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 bg-zinc-900 py-5 text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enviando pedido...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Confirmar pedido por WhatsApp
                  </>
                )}
              </button>
              <p className="text-center text-sm italic text-on-surface-variant">
                Checkout seguro. Enviaremos los detalles de tu bolsa al artesano para confirmar
                disponibilidad.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </form>
  )
}

function CheckoutTotals({ subtotal }: { subtotal: number }) {
  return (
    <>
      <div className="flex justify-between text-sm">
        <span className="uppercase tracking-wider text-on-surface-variant">Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="uppercase tracking-wider text-on-surface-variant">Envío</span>
        <span className="text-on-surface-variant">A coordinar</span>
      </div>
      <div className="flex justify-between border-t border-outline-variant pt-4 font-serif text-xl text-on-surface">
        <span>Total</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
    </>
  )
}
