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

  const chipClass = (active: boolean) =>
    [
      'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-300',
      active
        ? 'bg-ink text-white shadow-md shadow-ink/20'
        : 'bg-surface text-on-surface-variant hover:-translate-y-0.5 hover:bg-primary-soft hover:text-primary',
    ].join(' ')

  return (
    <aside className="w-full shrink-0 lg:w-56 xl:w-64">
      <nav aria-label="Filtrar por marca" className="lg:sticky lg:top-28">
        <section className="rounded-3xl bg-white p-5 shadow-card">
          <h2 className="mb-4 text-xs font-bold tracking-[0.22em] text-on-surface-variant uppercase">
            Marca
          </h2>
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-2">
            <li>
              <Link href={`/categorias/${categorySlug}`} className={chipClass(!activeBrand)}>
                <span>Todas</span>
                <span className="text-xs opacity-60">{totalCount}</span>
              </Link>
            </li>
            {brands.map((brand) => (
              <li key={brand.id}>
                <Link
                  href={`/categorias/${categorySlug}?marca=${brand.slug}`}
                  className={chipClass(activeBrand === brand.slug)}
                >
                  <span className="truncate">{brand.name}</span>
                  <span className="text-xs opacity-60">{brand.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </nav>
    </aside>
  )
}
