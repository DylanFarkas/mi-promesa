import { MessageCircle, ShieldCheck, Truck } from 'lucide-react'

const BENEFITS = [
  {
    icon: Truck,
    title: 'Envío prioritario',
    description: 'Coordinamos tu entrega con atención personalizada en cada pedido.',
  },
  {
    icon: ShieldCheck,
    title: 'Autenticidad garantizada',
    description: 'Productos originales, directamente de las marcas que distribuimos.',
  },
  {
    icon: MessageCircle,
    title: 'Atención por WhatsApp',
    description: 'Asesoría en tiempo real para recomendaciones y seguimiento de tu pedido.',
  },
] as const

export function BenefitsStrip() {
  return (
    <section className="border-y border-zinc-100 bg-surface-container-low py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <Icon className="mb-6 h-10 w-10 text-secondary" strokeWidth={1.25} />
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-on-surface">
                {title}
              </h4>
              <p className="max-w-xs text-sm leading-relaxed text-on-surface-variant">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

