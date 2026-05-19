import Link from 'next/link'

export type BrandCategoryFilter = {
  id: string
  name: string
  slug: string
  count: number
}

interface BrandCategorySidebarProps {
  brandSlug: string
  categories: BrandCategoryFilter[]
  totalCount: number
  activeCategory?: string | null
}

export function BrandCategorySidebar({
  brandSlug,
  categories,
  totalCount,
  activeCategory,
}: BrandCategorySidebarProps) {
  if (categories.length === 0) return null

  const linkClass = (active: boolean) =>
    [
      'flex items-center justify-between text-sm transition-colors',
      active ? 'font-medium text-[#1a1c1c]' : 'text-[#444748] hover:text-[#1a1c1c]',
    ].join(' ')

  return (
    <aside className="w-full shrink-0 lg:w-56 xl:w-64">
      <nav
        aria-label="Filtrar por categoría"
        className="lg:sticky lg:top-32 lg:space-y-10"
      >
        <section className="border-b border-outline-variant pb-6">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-on-surface">
            Categoría
          </h2>
          <ul className="space-y-3">
            <li>
              <Link
                href={`/marcas/${brandSlug}`}
                className={linkClass(!activeCategory)}
              >
                <span>Todos</span>
                <span className="text-[10px] opacity-50">{totalCount}</span>
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/marcas/${brandSlug}?categoria=${cat.slug}`}
                  className={linkClass(activeCategory === cat.slug)}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-50">{cat.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </nav>
    </aside>
  )
}
