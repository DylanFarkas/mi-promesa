import { ArrowUpRight, MessageCircle, ShieldCheck, Truck } from 'lucide-react'
import { StoreSticker, type StoreStickerShape } from '@/components/store/StoreSticker'

const WHATSAPP_HREF = 'https://wa.me/521xxxxxxxxxx'

const PROMISES = [
  {
    icon: Truck,
    index: '01',
    title: 'Envío\nprioritario',
    description: 'Coordinamos tu entrega con atención personalizada en cada pedido.',
    href: '/productos',
    label: 'Ver catálogo',
    shape: 'a' as StoreStickerShape,
    face: 'bg-primary text-white',
    back: 'bg-secondary',
    iconWell: 'bg-secondary text-ink',
    meta: 'text-white/65',
    link: 'text-secondary hover:text-white',
    lift: 'md:mt-0',
  },
  {
    icon: ShieldCheck,
    index: '02',
    title: 'Original,\nsin atajos',
    description: 'Productos auténticos, directo de las marcas que distribuimos.',
    href: '/marcas',
    label: 'Ver marcas',
    shape: 'b' as StoreStickerShape,
    face: 'bg-sand text-ink',
    back: 'bg-primary',
    iconWell: 'bg-ink text-secondary',
    meta: 'text-ink/55',
    link: 'text-primary hover:text-primary-deep',
    lift: 'md:mt-8',
  },
  {
    icon: MessageCircle,
    index: '03',
    title: 'Habla\ncon nosotros',
    description: 'Asesoría en tiempo real por WhatsApp, del consejo al seguimiento.',
    href: WHATSAPP_HREF,
    label: 'Abrir WhatsApp',
    external: true,
    shape: 'c' as StoreStickerShape,
    face: 'bg-secondary text-ink',
    back: 'bg-ink',
    iconWell: 'bg-ink text-secondary',
    meta: 'text-ink/60',
    link: 'text-ink/80 hover:text-ink',
    lift: 'md:mt-3',
  },
] as const

export function BenefitsStrip() {
  return (
    <section className="relative overflow-hidden bg-paper py-20 md:py-28">
      <div className="store-dots pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute top-[45%] right-[-8%] h-64 w-64 rounded-full bg-secondary-container/50 blur-[80px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-col gap-8 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-4xl font-bold tracking-tight text-ink md:text-5xl lg:text-[3.25rem]">
              Cada pedido lleva una{' '}
              <span className="store-squiggle">promesa</span>
            </h2>
          </div>

          <div className="flex items-center gap-5 md:max-w-xs md:text-right">
            <p className="text-sm leading-relaxed text-on-surface-variant md:order-1">
              Envío cuidado, productos originales y alguien real al otro lado del chat.
            </p>
          </div>
        </div>

        <div
          className="pointer-events-none relative z-0 -mb-6 flex justify-center overflow-hidden md:-mb-14"
          aria-hidden
        >
          <p className="benefits-wordmark select-none font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-[clamp(5.5rem,22vw,14rem)] leading-[0.82] font-bold tracking-tighter whitespace-nowrap uppercase">
            Promesa
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start md:gap-7 md:pt-4">
          {PROMISES.map((promise) => {
            const Icon = promise.icon

            return (
              <StoreSticker
                key={promise.index}
                size="lg"
                shape={promise.shape}
                back={promise.back}
                face={promise.face}
                href={promise.href}
                external={'external' in promise && promise.external}
                className={promise.lift}
                faceClassName="min-h-[290px] p-7 md:min-h-[350px] md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[-8deg] ${promise.iconWell}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span
                    className={`font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-xs font-bold tracking-[0.22em] ${promise.meta}`}
                  >
                    {promise.index}
                  </span>
                </div>

                <div className="mt-auto space-y-3 pt-16 md:pt-20">
                  <h3 className="font-[family-name:var(--font-store-display-face),system-ui,sans-serif] text-2xl leading-[1.05] font-bold tracking-tight whitespace-pre-line md:text-3xl">
                    {promise.title}
                  </h3>
                  <p className={`max-w-62 text-sm leading-relaxed ${promise.meta}`}>
                    {promise.description}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 pt-2 text-sm font-bold transition-colors ${promise.link}`}
                  >
                    {promise.label}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </StoreSticker>
            )
          })}
        </div>
      </div>
    </section>
  )
}
