import type { Metadata } from 'next'
import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'

export const metadata: Metadata = {
  title: {
    default: 'Mi Promesa — Distribuidora',
    template: '%s | Mi Promesa',
  },
  description:
    'Productos de belleza, bienestar, hogar y más. Calidad garantizada con atención personalizada.',
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  )
}
