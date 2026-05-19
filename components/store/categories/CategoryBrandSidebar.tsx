import Link from 'next/link'

export type CategoryBrandFilter = {
  id: string
  name: string
  slug: string
  count: number
}

interface CategoryBrandSidebarProps {
  categorySlug: string
  brands: CategoryBrandFilter[]
  totalCount: number
  activeBrand?: string | null
}

export function CategoryBrandSidebar({
  categorySlug,
  brands,
  totalCount,
  activeBrand,
}: CategoryBrandSidebarProps) {
  if (brands.length === 0) return null

  const linkClass = (active: boolean) =>
    [
      'flex items-center justify-between text-sm transition-colors',
      active ? 'font-medium text-on-surface' : 'text-on-surface-variant hover:text-on-surface',
    ].join(' ')

  return (
    <aside className="w-full shrink-0 lg:w-56 xl:w-64">
      <nav aria-label="Filtrar por marca" className="lg:sticky lg:top-32 lg:space-y-10">
        <section className="border-b border-outline-variant pb-6">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-on-surface">
            Marca
          </h2>
          <ul className="space-y-3">
            <li>
              <Link href={`/categorias/${categorySlug}`} className={linkClass(!activeBrand)}>
                <span>Todas</span>
                <span className="text-[10px] opacity-50">{totalCount}</span>
              </Link>
            </li>
            {brands.map((brand) => (
              <li key={brand.id}>
                <Link
                  href={`/categorias/${categorySlug}?marca=${brand.slug}`}
                  className={linkClass(activeBrand === brand.slug)}
                >
                  <span>{brand.name}</span>
                  <span className="text-[10px] opacity-50">{brand.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </nav>
    </aside>
  )
}
