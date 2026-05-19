import type { SupabaseClient } from '@supabase/supabase-js'
import {
  fetchProductIdsWithAdditionalCategory,
  productsInCategoryOrFilter,
} from '@/lib/supabase/productCategories'

type CategoryRow = { id: string; slug: string; name: string }

export async function getBrandCategoryCounts(
  supabase: SupabaseClient,
  brandId: string,
  categories: CategoryRow[],
) {
  const { count: totalCount } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('brand_id', brandId)
    .eq('is_active', true)

  const counts = await Promise.all(
    categories.map(async (cat) => {
      const additionalProductIds = await fetchProductIdsWithAdditionalCategory(supabase, cat.id)
      const catFilter = productsInCategoryOrFilter(cat.id, additionalProductIds)

      let query = supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('brand_id', brandId)
        .eq('is_active', true)

      query =
        catFilter.mode === 'primary_only'
          ? query.eq('category_id', catFilter.categoryId)
          : query.or(catFilter.or)

      const { count } = await query
      return { ...cat, count: count ?? 0 }
    }),
  )

  return {
    total: totalCount ?? 0,
    categories: counts,
  }
}
