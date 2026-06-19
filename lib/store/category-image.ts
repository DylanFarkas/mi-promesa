import type { SupabaseClient } from '@supabase/supabase-js'

type ProductImageRow = {
  category_id: string
  primary_image_url: string | null
}

/** Prioridad: imagen de categoría → fallback de producto → null. */
export function resolveCategoryImageUrl(
  categoryImageUrl: string | null | undefined,
  productFallbackUrl: string | null | undefined,
): string | null {
  if (categoryImageUrl) return categoryImageUrl
  if (productFallbackUrl) return productFallbackUrl
  return null
}

/** Primera imagen de producto activo por categoría (más reciente). */
export async function getProductImageFallbacks(
  supabase: SupabaseClient,
  categoryIds: string[],
): Promise<Record<string, string | null>> {
  if (categoryIds.length === 0) return {}

  const { data: sampleProducts } = await supabase
    .from('products')
    .select('category_id, primary_image_url')
    .in('category_id', categoryIds)
    .eq('is_active', true)
    .not('primary_image_url', 'is', null)
    .order('created_at', { ascending: false })

  const fallbacks: Record<string, string | null> = {}
  for (const row of (sampleProducts ?? []) as ProductImageRow[]) {
    if (!fallbacks[row.category_id] && row.primary_image_url) {
      fallbacks[row.category_id] = row.primary_image_url
    }
  }
  return fallbacks
}

/** Imagen de un solo producto como fallback para una categoría. */
export async function getProductImageFallback(
  supabase: SupabaseClient,
  categoryId: string,
): Promise<string | null> {
  const fallbacks = await getProductImageFallbacks(supabase, [categoryId])
  return fallbacks[categoryId] ?? null
}
