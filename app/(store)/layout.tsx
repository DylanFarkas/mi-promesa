import type { Metadata } from 'next'
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-store-sans-face',
  weight: ['400', '500', '600', '700'],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-store-display-face',
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Mi Promesa — Distribuidora',
    template: '%s | Mi Promesa',
  },
  description:
    'Distribuidora de productos para hogar, belleza, nutrición y más. Variedad de marcas con atención personalizada.',
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${jakarta.variable} ${spaceGrotesk.variable} flex min-h-dvh flex-col bg-paper font-[family-name:var(--font-store-sans-face),system-ui,sans-serif] text-on-surface antialiased`}
    >
      <StoreHeader />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <StoreFooter />
    </div>
  )
}
