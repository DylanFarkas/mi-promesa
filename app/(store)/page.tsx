import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/store/ProductCard'
import { BrandCard } from '@/components/store/BrandCard'

export const revalidate = 60

async function getData() {
  const supabase = await createClient()

  const [brandsRes, productsRes] = await Promise.all([
    supabase
      .from('brands')
      .select('id, name, slug, description')
      .eq('is_active', true)
      .order('sort_order')
      .limit(6),
    supabase
      .from('products')
      .select('id, name, slug, price, compare_at_price, primary_image_url, short_description, brand:brands!inner(name, slug)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  return {
    brands: brandsRes.data ?? [],
    products: productsRes.data ?? [],
  }
}

export default async function HomePage() {
  const { brands, products } = await getData()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-gradient(to bottom, #f9fafb, #f3f4f6, #e5e7eb, #d1d5db, #9ca3af)">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-medium text-rose-700 mb-6">
              <Sparkles size={14} />
              Distribuidora oficial
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900 leading-tight tracking-tight">
              Productos que{' '}
              <span className="text-rose-500">cuidan</span>{' '}
              lo que más importa
            </h1>
            <p className="mt-5 text-lg text-stone-500 leading-relaxed max-w-xl">
              Belleza, bienestar, nutrición y hogar. Marcas seleccionadas con la calidad que mereces,
              entregadas con atención personalizada.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/marcas"
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-600 transition-colors"
              >
                Explorar marcas
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/categorias"
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Ver categorías
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-rose-100/50 blur-3xl" />
        <div className="absolute -bottom-16 right-32 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl" />
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-1">
                Catálogo
              </p>
              <h2 className="text-2xl font-bold text-stone-900">Nuestras marcas</h2>
            </div>
            <Link
              href="/marcas"
              className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-rose-600 transition-colors"
            >
              Ver todas
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      {products.length > 0 && (
        <section className="bg-stone-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-1">
                  Lo más nuevo
                </p>
                <h2 className="text-2xl font-bold text-stone-900">Productos destacados</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    brand: product.brand as unknown as { name: string; slug: string },
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA WhatsApp */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-stone-900 px-8 py-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-3">
            ¿Tienes dudas?
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Hablemos por WhatsApp
          </h2>
          <p className="text-stone-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Coordinamos tu pedido directamente por WhatsApp. Te atendemos con gusto.
          </p>
          <a
            href="https://wa.me/521xxxxxxxxxx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-7 py-3.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
          >
            Abrir WhatsApp
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  )
}
