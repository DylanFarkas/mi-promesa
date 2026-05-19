import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/admin/PageHeader'
import { ProductForm } from '../_components/ProductForm'
import { GalleryManager } from '@/components/admin/GalleryManager'
import { FormSection } from '@/components/admin/FormSection'
import { Alert } from '@/components/ui/Alert'
import type { Brand, Category, Product, ProductImage } from '@/types/database'

export const metadata: Metadata = { title: 'Editar producto' }

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ created?: string }>
}) {
  const { id } = await params
  const { created } = await searchParams
  const supabase = await createClient()

  const [
    { data: productData },
    { data: brandsData },
    { data: categoriesData },
    { data: imagesData },
    { data: extraCatsData },
  ] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('brands').select('id, name').eq('is_active', true).order('name'),
    supabase.from('categories').select('id, name, brand_id').eq('is_active', true).order('name'),
    supabase
      .from('product_images')
      .select('*')
      .eq('product_id', id)
      .order('sort_order', { ascending: true }),
    supabase.from('product_categories').select('category_id').eq('product_id', id),
  ])

  const product = productData as Product | null
  const brands = brandsData as Pick<Brand, 'id' | 'name'>[] | null
  const categories = categoriesData as Pick<Category, 'id' | 'name' | 'brand_id'>[] | null
  const images = imagesData as ProductImage[] | null
  const initialExtraCategoryIds =
    (extraCatsData as { category_id: string }[] | null)?.map((r) => r.category_id) ?? []

  if (!product) notFound()

  return (
    <div className="space-y-8">
      {created === '1' && (
        <Alert
          variant="success"
          title="¡Producto creado!"
          message="Ahora puedes añadir imágenes de galería y ajustar cualquier detalle."
        />
      )}

      <PageHeader
        title={`Editar: ${product.name}`}
        description="Modifica los datos de este producto."
      />

      <ProductForm
        product={product}
        brands={brands ?? []}
        categories={categories ?? []}
        initialExtraCategoryIds={initialExtraCategoryIds}
      />

      {/* Galería de imágenes secundarias */}
      <div className="border-t border-slate-200 pt-8">
        <FormSection
          title="Galería de imágenes"
          description="Imágenes adicionales del producto. Puedes añadir, quitar y cambiar el orden. Se muestran en la ficha de producto de la tienda."
        >
          <GalleryManager
            productId={product.id}
            initialImages={images ?? []}
          />
        </FormSection>
      </div>
    </div>
  )
}
