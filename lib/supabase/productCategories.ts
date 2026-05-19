import type { SupabaseClient } from '@supabase/supabase-js'

/** IDs de productos que tienen `category_id` como categoría adicional (no principal). */
export async function fetchProductIdsWithAdditionalCategory(
  supabase: SupabaseClient,
  categoryId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('product_id')
    .eq('category_id', categoryId)

  if (error || !data?.length) return []
  const rows = data as { product_id: string }[]
  return [...new Set(rows.map((r) => r.product_id))]
}

/** Filtro PostgREST: categoría principal O vínculo en product_categories. */
export function productsInCategoryOrFilter(categoryId: string, additionalProductIds: string[]) {
  if (additionalProductIds.length === 0) {
    return { mode: 'primary_only' as const, categoryId }
  }
  return {
    mode: 'or_primary_or_ids' as const,
    or: `category_id.eq.${categoryId},id.in.(${additionalProductIds.join(',')})`,
  }
}

export async function replaceProductCategoryExtras(
  supabase: SupabaseClient,
  productId: string,
  primaryCategoryId: string,
  extraCategoryIds: string[],
): Promise<{ message: string } | null> {
  const extras = [...new Set(extraCategoryIds.filter((id) => id && id !== primaryCategoryId))]

  const { error: delErr } = await supabase
    .from('product_categories')
    .delete()
    .eq('product_id', productId)
  if (delErr) return { message: delErr.message }

  if (extras.length === 0) return null

  const { error: insErr } = await supabase.from('product_categories').insert(
    extras.map((category_id) => ({ product_id: productId, category_id })) as never[],
  )
  if (insErr) return { message: insErr.message }
  return null
}
