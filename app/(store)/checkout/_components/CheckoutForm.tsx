'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingBag, Loader2, Truck, Send } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { formatCurrency } from '@/lib/utils'
import { StoreEmptyState } from '@/components/store/StoreEmptyState'

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
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-transparent bg-white px-4 py-3 text-base text-ink shadow-card transition-all placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/15"
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
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <StoreEmptyState
        icon={ShoppingBag}
        title="Tu carrito está vacío"
        description="Agrega productos al carrito para continuar con tu pedido."
        href="/productos"
        label="Explorar productos"
        tone="sand"
        className="py-16"
      />
    )
  }

  const total = subtotal()

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <header className="mb-10">
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-primary uppercase">
              <span aria-hidden>✦</span>
              Último paso
            </span>
            <h1 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Checkout
            </h1>
            <p className="mt-3 max-w-md text-base leading-relaxed text-on-surface-variant">
              Completa tus datos para finalizar tu pedido. Te contactaremos por WhatsApp para
              coordinar el pago y la entrega.
            </p>
          </header>

          {error && (
            <div className="mb-8 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
              {error}
            </div>
          )}

          <section className="space-y-10">
            <div className="space-y-6">
              <h2 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-xl font-bold text-ink">
                Datos de entrega
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
                  className="mb-2 block text-sm font-semibold text-ink"
                >
                  Notas adicionales
                </label>
                <textarea
                  id="customerNotes"
                  value={form.customerNotes}
                  onChange={(e) => handleChange('customerNotes', e.target.value)}
                  rows={3}
                  placeholder="Instrucciones especiales, horario de entrega..."
                  className="w-full resize-none rounded-2xl border border-transparent bg-white px-4 py-3 text-base text-ink shadow-card transition-all placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-xl font-bold text-ink">
                Método de envío
              </h2>
              <div className="flex cursor-pointer items-center justify-between rounded-2xl bg-primary-soft/60 p-4 shadow-card ring-2 ring-primary/40 transition-all">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-pop">
                    <Truck size={20} strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">Envío estándar</p>
                    <p className="text-sm text-on-surface-variant">3–5 días hábiles</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary">A coordinar</span>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-28 space-y-6 rounded-4xl bg-white p-6 shadow-float md:p-7">
            <h2 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-xl font-bold text-ink">
              Resumen del pedido
            </h2>

            <ul className="hide-scrollbar max-h-100 space-y-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 rounded-2xl bg-surface/70 p-3"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag size={18} className="text-outline-variant" />
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 grow flex-col justify-between">
                    <div>
                      <h4 className="line-clamp-2 text-sm font-semibold text-ink">{item.title}</h4>
                      <p className="text-xs text-primary">{item.brandName}</p>
                      <p className="text-xs text-on-surface-variant">Cant: {item.quantity}</p>
                    </div>
                    <p className="self-end text-sm font-bold text-ink">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-outline-variant/40 pt-5">
              <CheckoutTotals subtotal={total} />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-store btn-store--primary w-full py-4 disabled:cursor-not-allowed disabled:opacity-60"
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
              <p className="text-center text-xs leading-relaxed text-on-surface-variant">
                Checkout seguro. Confirmaremos disponibilidad y te escribiremos por WhatsApp.
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
        <span className="text-on-surface-variant">Subtotal</span>
        <span className="font-medium text-ink">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-on-surface-variant">Envío</span>
        <span className="text-on-surface-variant">A coordinar</span>
      </div>
      <div className="flex justify-between border-t border-outline-variant/40 pt-3 text-lg font-bold text-ink">
        <span>Total</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
    </>
  )
}
