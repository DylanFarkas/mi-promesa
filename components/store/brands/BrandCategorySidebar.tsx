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

  const chipClass = (active: boolean) =>
    [
      'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-300',
      active
        ? 'bg-ink text-white shadow-md shadow-ink/20'
        : 'bg-surface text-on-surface-variant hover:-translate-y-0.5 hover:bg-primary-soft hover:text-primary',
    ].join(' ')

  return (
    <aside className="w-full shrink-0 lg:w-56 xl:w-64">
      <nav aria-label="Filtrar por categoría" className="lg:sticky lg:top-28">
        <section className="rounded-3xl bg-white p-5 shadow-card">
          <h2 className="mb-4 text-xs font-bold tracking-[0.22em] text-on-surface-variant uppercase">
            Categoría
          </h2>
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-2">
            <li>
              <Link href={`/marcas/${brandSlug}`} className={chipClass(!activeCategory)}>
                <span>Todos</span>
                <span className="text-xs opacity-60">{totalCount}</span>
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/marcas/${brandSlug}?categoria=${cat.slug}`}
                  className={chipClass(activeCategory === cat.slug)}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-xs opacity-60">{cat.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </nav>
    </aside>
  )
}
