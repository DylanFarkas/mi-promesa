import type { Metadata } from 'next'
import { Inter, Noto_Serif } from 'next/font/google'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: {
    default: 'Mi Promesa — Curated Excellence',
    template: '%s | Mi Promesa',
  },
  description:
    'Productos de belleza, bienestar, hogar y más. Calidad curada con atención personalizada.',
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${notoSerif.variable} flex min-h-dvh flex-col bg-surface font-[family-name:var(--font-inter),system-ui,sans-serif] text-on-surface antialiased`}
    >
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  )
}
