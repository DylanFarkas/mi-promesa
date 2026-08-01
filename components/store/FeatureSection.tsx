import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Sección destacada reutilizable.
 *
 * Pensada para componer "bandas" editoriales a lo largo de la tienda sin tener
 * que reescribir el maquetado cada vez. Es 100% controlable por props:
 *
 *  - `variant="split"`   → imagen a un lado y texto al otro.
 *  - `variant="overlay"` → imagen a sangre completa con el texto por encima.
 *
 * Ejemplos:
 *
 * ```tsx
 * // Imagen a la izquierda, texto a la derecha (tono claro)
 * <FeatureSection
 *   variant="split"
 *   mediaSide="left"
 *   eyebrow="Nuestra historia"
 *   title="Calidad y confianza en cada elección"
 *   description="..."
 *   cta={{ label: 'Conocer más', href: '/nosotros', variant: 'underline' }}
 *   media={{ src: '/images/foo.jpg', alt: '...' }}
 * />
 *
 * // Imagen a pantalla completa con el texto encima, abajo a la izquierda
 * <FeatureSection
 *   variant="overlay"
 *   align="bottom-left"
 *   height="screen"
 *   eyebrow="LELO"
 *   title="Héroe del placer"
 *   cta={{ label: 'Descúbrelo', href: '/marcas/lelo', variant: 'solid' }}
 *   media={{ src: '/images/bar.jpg', alt: '...', priority: true }}
 * />
 * ```
 */

type CtaVariant = 'solid' | 'outline' | 'underline'

export type FeatureCta = {
  label: string
  href: string
  /** Estilo visual del CTA. `underline` = enlace con subrayado; `solid` = botón sólido; `outline` = botón con borde tipo pastilla. */
  variant?: CtaVariant
}

export type FeatureMedia = {
  src: string
  alt: string
  /** `object-position`, p. ej. `'center'`, `'top'`, `'70% 20%'`. */
  position?: string
  /** Marca la imagen como prioritaria (LCP). Úsalo solo en secciones visibles al cargar. */
  priority?: boolean
}

type FeatureTone = 'light' | 'dark'

type OverlayAlign =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

type FeatureBaseProps = {
  /** Etiqueta superior breve (eyebrow). */
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  cta?: FeatureCta
  secondaryCta?: FeatureCta
  media: FeatureMedia
  /** Estilo del título: editorial con serif o titular sans en mayúsculas. */
  headingVariant?: 'serif' | 'display'
  /** Esquema de color del texto y los CTAs. */
  tone?: FeatureTone
  id?: string
  className?: string
}

type SplitProps = FeatureBaseProps & {
  variant?: 'split'
  /** Lado de la imagen en escritorio. */
  mediaSide?: 'left' | 'right'
  /** Color de fondo opcional de la banda (clase Tailwind). Por defecto hereda del fondo de la página. */
  background?: string
}

type OverlayProps = FeatureBaseProps & {
  variant: 'overlay'
  /** Anclaje del bloque de texto sobre la imagen. */
  align?: OverlayAlign
  /** Altura de la banda. */
  height?: 'md' | 'lg' | 'screen'
  /** Intensidad del degradado oscuro que mejora la legibilidad del texto. */
  scrim?: 'none' | 'soft' | 'strong'
}

export type FeatureSectionProps = SplitProps | OverlayProps

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const toneText: Record<FeatureTone, { eyebrow: string; title: string; body: string; rule: string }> = {
  light: {
    eyebrow: 'text-primary',
    title: 'text-ink',
    body: 'text-on-surface-variant',
    rule: 'bg-primary/50',
  },
  dark: {
    eyebrow: 'text-secondary',
    title: 'text-white',
    body: 'text-white/80',
    rule: 'bg-secondary/70',
  },
}

function headingClasses(variant: 'serif' | 'display', isOverlay: boolean) {
  const displayFont =
    'font-[family-name:var(--font-store-display-face),system-ui,sans-serif] font-bold tracking-tight'
  if (variant === 'display') {
    return isOverlay
      ? `${displayFont} leading-[1.05] text-3xl sm:text-4xl md:text-5xl lg:text-6xl`
      : `${displayFont} leading-[1.08] text-3xl md:text-4xl`
  }
  return isOverlay
    ? `${displayFont} leading-[1.1] text-3xl sm:text-4xl md:text-5xl`
    : `${displayFont} leading-[1.15] text-2xl md:text-[2rem]`
}

function Cta({ cta, tone }: { cta: FeatureCta; tone: FeatureTone }) {
  const variant = cta.variant ?? 'solid'

  if (variant === 'underline') {
    const color = tone === 'dark' ? 'border-white text-white' : 'border-ink text-ink'
    return (
      <Link
        href={cta.href}
        className={`inline-flex items-center text-sm font-semibold transition-all ${color} border-b pb-1 hover:opacity-70`}
      >
        {cta.label}
      </Link>
    )
  }

  if (variant === 'outline') {
    return (
      <Link
        href={cta.href}
        className={`btn-store ${tone === 'dark' ? 'btn-store--ghost-light' : 'btn-store--ghost'}`}
      >
        {cta.label}
      </Link>
    )
  }

  return (
    <Link
      href={cta.href}
      className={`btn-store ${tone === 'dark' ? 'btn-store--yellow' : 'btn-store--primary'}`}
    >
      {cta.label}
    </Link>
  )
}

function FeatureContent({
  eyebrow,
  title,
  description,
  cta,
  secondaryCta,
  tone,
  headingVariant,
  isOverlay,
  align = 'center-left',
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  cta?: FeatureCta
  secondaryCta?: FeatureCta
  tone: FeatureTone
  headingVariant: 'serif' | 'display'
  isOverlay: boolean
  align?: OverlayAlign
}) {
  const colors = toneText[tone]
  const centered = align.endsWith('center')
  return (
    <div className={`space-y-5 md:space-y-6 ${centered ? 'text-center' : 'text-left'}`}>
      {eyebrow ? (
        <span
          className={`flex items-center gap-3 text-sm font-semibold ${colors.eyebrow} ${
            centered ? 'justify-center' : ''
          }`}
        >
          <span className={`hidden h-px w-8 sm:inline-block ${colors.rule}`} aria-hidden />
          {eyebrow}
        </span>
      ) : null}

      <h2 className={`${headingClasses(headingVariant, isOverlay)} ${colors.title} text-balance`}>
        {title}
      </h2>

      {description ? (
        <p className={`max-w-prose text-base leading-relaxed ${colors.body} ${centered ? 'mx-auto' : ''}`}>
          {description}
        </p>
      ) : null}

      {cta || secondaryCta ? (
        <div className={`flex flex-wrap items-center gap-x-8 gap-y-4 pt-2 ${centered ? 'justify-center' : ''}`}>
          {cta ? <Cta cta={cta} tone={tone} /> : null}
          {secondaryCta ? <Cta cta={secondaryCta} tone={tone} /> : null}
        </div>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Split layout                                */
/* -------------------------------------------------------------------------- */

function SplitSection({
  eyebrow,
  title,
  description,
  cta,
  secondaryCta,
  media,
  tone = 'light',
  headingVariant = 'serif',
  mediaSide = 'left',
  background,
  id,
  className = '',
}: SplitProps) {
  return (
    <section id={id} className={`${background ?? 'bg-paper'} py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div
          className={`flex flex-col items-center gap-10 md:gap-16 ${
            mediaSide === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
          }`}
        >
          <div className="relative w-full flex-[1.15]">
            <div
              className={`group relative aspect-4/3 w-full overflow-hidden shadow-float md:aspect-3/2 ${
                mediaSide === 'right'
                  ? 'rounded-[2.5rem] md:rounded-tr-[7rem]'
                  : 'rounded-[2.5rem] md:rounded-tl-[7rem]'
              }`}
            >
              <Image
                src={media.src}
                alt={media.alt}
                fill
                priority={media.priority}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                style={media.position ? { objectPosition: media.position } : undefined}
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            </div>
            {/* Destello de marca superpuesto a la imagen */}
            <span
              className={`absolute -bottom-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-xl text-ink shadow-card ${
                mediaSide === 'right' ? '-left-3 md:-left-5' : '-right-3 md:-right-5'
              }`}
              aria-hidden
            >
              ✦
            </span>
          </div>

          <div className="w-full flex-1">
            <FeatureContent
              eyebrow={eyebrow}
              title={title}
              description={description}
              cta={cta}
              secondaryCta={secondaryCta}
              tone={tone}
              headingVariant={headingVariant}
              isOverlay={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Overlay layout                               */
/* -------------------------------------------------------------------------- */

const overlayAlignClasses: Record<OverlayAlign, string> = {
  'top-left': 'items-start justify-start text-left',
  'top-center': 'items-start justify-center text-center',
  'top-right': 'items-start justify-end text-right',
  'center-left': 'items-center justify-start text-left',
  center: 'items-center justify-center text-center',
  'center-right': 'items-center justify-end text-right',
  'bottom-left': 'items-end justify-start text-left',
  'bottom-center': 'items-end justify-center text-center',
  'bottom-right': 'items-end justify-end text-right',
}

const overlayHeight: Record<NonNullable<OverlayProps['height']>, string> = {
  md: 'min-h-[60vh]',
  lg: 'min-h-[78vh]',
  screen: 'min-h-dvh',
}

// Clases estáticas completas: Tailwind necesita verlas literalmente para generarlas.
const SCRIM_SOFT = {
  left: 'bg-linear-to-r from-ink/70 via-ink/25 to-transparent',
  right: 'bg-linear-to-l from-ink/70 via-ink/25 to-transparent',
  top: 'bg-linear-to-b from-ink/70 via-ink/25 to-transparent',
  bottom: 'bg-linear-to-t from-ink/70 via-ink/25 to-transparent',
  center: 'bg-ink/35',
} as const

const SCRIM_STRONG = {
  left: 'bg-linear-to-r from-ink/88 via-ink/45 to-transparent',
  right: 'bg-linear-to-l from-ink/88 via-ink/45 to-transparent',
  top: 'bg-linear-to-b from-ink/88 via-ink/45 to-transparent',
  bottom: 'bg-linear-to-t from-ink/88 via-ink/45 to-transparent',
  center: 'bg-ink/55',
} as const

function scrimDirection(align: OverlayAlign): keyof typeof SCRIM_SOFT {
  if (align.includes('left')) return 'left'
  if (align.includes('right')) return 'right'
  if (align.startsWith('top')) return 'top'
  if (align.startsWith('bottom')) return 'bottom'
  return 'center'
}

function scrimClasses(align: OverlayAlign, scrim: NonNullable<OverlayProps['scrim']>) {
  if (scrim === 'none') return ''
  const dir = scrimDirection(align)
  return scrim === 'strong' ? SCRIM_STRONG[dir] : SCRIM_SOFT[dir]
}

function OverlaySection({
  eyebrow,
  title,
  description,
  cta,
  secondaryCta,
  media,
  tone = 'dark',
  headingVariant = 'serif',
  align = 'bottom-left',
  height = 'lg',
  scrim = 'soft',
  id,
  className = '',
}: OverlayProps) {
  return (
    <section id={id} className={`relative flex overflow-hidden ${overlayHeight[height]} ${className}`}>
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority={media.priority}
        className="object-cover"
        style={media.position ? { objectPosition: media.position } : undefined}
        sizes="100vw"
      />

      <span className={`pointer-events-none absolute inset-0 ${scrimClasses(align, scrim)}`} aria-hidden />

      <div className={`relative z-10 flex w-full px-6 py-16 md:px-12 md:py-20 ${overlayAlignClasses[align]}`}>
        <div className="w-full max-w-xl">
          <FeatureContent
            eyebrow={eyebrow}
            title={title}
            description={description}
            cta={cta}
            secondaryCta={secondaryCta}
            tone={tone}
            headingVariant={headingVariant}
            isOverlay
            align={align}
          />
        </div>
      </div>
    </section>
  )
}


export function FeatureSection(props: FeatureSectionProps) {
  if (props.variant === 'overlay') {
    return <OverlaySection {...props} />
  }
  return <SplitSection {...props} />
}
