import type { SupabaseClient } from '@supabase/supabase-js'
import {
  fetchProductIdsWithAdditionalCategory,
  productsInCategoryOrFilter,
} from '@/lib/supabase/productCategories'

type BrandRow = { id: string; slug: string; name: string }

function categoryProductQuery(
  supabase: SupabaseClient,
  categoryId: string,
  additionalProductIds: string[],
) {
  const catFilter = productsInCategoryOrFilter(categoryId, additionalProductIds)
  let query = supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  return catFilter.mode === 'primary_only'
    ? query.eq('category_id', catFilter.categoryId)
    : query.or(catFilter.or)
}

export async function countProductsInCategory(
  supabase: SupabaseClient,
  categoryId: string,
) {
  const additionalProductIds = await fetchProductIdsWithAdditionalCategory(
    supabase,
    categoryId,
  )
  const { count } = await categoryProductQuery(supabase, categoryId, additionalProductIds)
  return count ?? 0
}

export async function getCategoryBrandCounts(
  supabase: SupabaseClient,
  categoryId: string,
  brands: BrandRow[],
) {
  const additionalProductIds = await fetchProductIdsWithAdditionalCategory(
    supabase,
    categoryId,
  )

  const total = await countProductsInCategory(supabase, categoryId)

  const brandsWithCounts = await Promise.all(
    brands.map(async (brand) => {
      let query = categoryProductQuery(supabase, categoryId, additionalProductIds)
      query = query.eq('brand_id', brand.id)
      const { count } = await query
      return { ...brand, count: count ?? 0 }
    }),
  )

  return {
    total,
    brands: brandsWithCounts.filter((b) => b.count > 0),
  }
}
