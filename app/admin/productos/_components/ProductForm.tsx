'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Alert } from '@/components/ui/Alert'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { FormSection } from '@/components/admin/FormSection'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { generateSlug } from '@/lib/utils'
import { replaceProductCategoryExtras } from '@/lib/supabase/productCategories'
import type { Brand, Category, Product } from '@/types/database'
import { Trash2 } from 'lucide-react'

interface ProductFormProps {
  product?: Product
  brands: Pick<Brand, 'id' | 'name'>[]
  categories: Pick<Category, 'id' | 'name' | 'brand_id'>[]
  /** Categorías adicionales (excluye la principal en `product.category_id`). */
  initialExtraCategoryIds?: string[]
}

export function ProductForm({
  product,
  brands,
  categories,
  initialExtraCategoryIds = [],
}: ProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!product

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [brandId, setBrandId] = useState(product?.brand_id ?? '')
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [shortDescription, setShortDescription] = useState(
    product?.short_description ?? '',
  )
  const [description, setDescription] = useState(product?.description ?? '')
  const [sku, setSku] = useState(product?.sku ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price?.toString() ?? '',
  )
  const [primaryImageUrl, setPrimaryImageUrl] = useState(
    product?.primary_image_url ?? '',
  )
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [extraCategoryIds, setExtraCategoryIds] = useState<string[]>(() => [
    ...initialExtraCategoryIds,
  ])

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)

  const filteredCategories = categories.filter(
    (c) => !c.brand_id || c.brand_id === brandId,
  )

  const prevBrandIdRef = useRef(brandId)

  useEffect(() => {
    if (prevBrandIdRef.current !== brandId) {
      prevBrandIdRef.current = brandId
      const timeout = setTimeout(() => {
        setCategoryId((prev) => {
          const isValid = filteredCategories.some((c) => c.id === prev)
          return isValid ? prev : ''
        })
      }, 0)
      return () => clearTimeout(timeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId])

  useEffect(() => {
    setExtraCategoryIds((prev) =>
      prev.filter((cId) =>
        categories.some(
          (c) => c.id === cId && (!c.brand_id || c.brand_id === brandId),
        ),
      ),
    )
  }, [brandId, categories])

  useEffect(() => {
    if (!categoryId) return
    setExtraCategoryIds((prev) => prev.filter((id) => id !== categoryId))
  }, [categoryId])

  function handleNameChange(value: string) {
    setName(value)
    if (!slugEdited) {
      setSlug(generateSlug(value))
    }
  }

  function handleSlugChange(value: string) {
    setSlug(generateSlug(value))
    setSlugEdited(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!brandId) {
      setError('Selecciona una marca.')
      return
    }
    if (!categoryId) {
      setError('Selecciona una categoría.')
      return
    }

    const priceNum = parseFloat(price)
    const compareAtNum = compareAtPrice ? parseFloat(compareAtPrice) : null

    if (isNaN(priceNum) || priceNum < 0) {
      setError('El precio debe ser un número válido mayor o igual a 0.')
      return
    }
    if (compareAtNum !== null && compareAtNum < priceNum) {
      setError('El precio de lista debe ser mayor o igual al precio de venta.')
      return
    }

    setLoading(true)

    const payload = {
      name: name.trim(),
      slug,
      brand_id: brandId,
      category_id: categoryId,
      short_description: shortDescription.trim() || null,
      description: description.trim() || null,
      sku: sku.trim() || null,
      price: priceNum,
      compare_at_price: compareAtNum,
      primary_image_url: primaryImageUrl.trim() || null,
      is_active: isActive,
    }

    if (isEditing) {
      const { error: dbError } = await supabase
        .from('products')
        .update(payload as never)
        .eq('id', product.id)

      if (dbError) {
        setLoading(false)
        setError(resolveProductError(dbError.message))
        return
      }

      const extraErr = await replaceProductCategoryExtras(
        supabase,
        product.id,
        categoryId,
        extraCategoryIds,
      )
      setLoading(false)

      if (extraErr) {
        setError(
          'Producto guardado, pero no se pudieron actualizar las categorías adicionales: ' +
            extraErr.message,
        )
        router.refresh()
        return
      }

      router.refresh()
    } else {
      const { data: newProduct, error: dbError } = await supabase
        .from('products')
        .insert(payload as never)
        .select('id')
        .single()

      if (dbError) {
        setLoading(false)
        setError(resolveProductError(dbError.message))
        return
      }

      const newId = (newProduct as { id: string }).id
      const extraErr = await replaceProductCategoryExtras(
        supabase,
        newId,
        categoryId,
        extraCategoryIds,
      )
      setLoading(false)

      if (extraErr) {
        setError(
          'Producto creado, pero las categorías adicionales no se guardaron: ' +
            extraErr.message +
            ' Puedes corregirlas aquí y volver a guardar.',
        )
        router.push(`/admin/productos/${newId}`)
        router.refresh()
        return
      }

      router.push(`/admin/productos/${newId}?created=1`)
    }
  }

  function resolveProductError(msg: string): string {
    if (msg.includes('products_slug')) return 'Ya existe un producto con ese slug en esta marca.'
    if (msg.includes('products_sku')) return 'Ya existe un producto con ese SKU.'
    if (msg.includes('enforce_product_category_brand'))
      return 'La categoría seleccionada no pertenece a la marca del producto.'
    if (msg.includes('enforce_product_category_link_brand'))
      return 'Una categoría adicional no es válida para esta marca.'
    if (msg.includes('La categoría principal no debe repetirse'))
      return 'Quita la categoría principal de la lista de adicionales.'
    return msg
  }

  async function handleDelete() {
    setDeleting(true)
    const { error: dbError } = await supabase
      .from('products')
      .delete()
      .eq('id', product!.id)
    setDeleting(false)
    setShowDeleteDialog(false)

    if (dbError) {
      setError('No se pudo eliminar el producto.')
      return
    }

    router.push('/admin/productos')
    router.refresh()
  }

  const brandOptions = [
    { value: '', label: 'Selecciona una marca' },
    ...brands.map((b) => ({ value: b.id, label: b.name })),
  ]

  const categoryOptions = [
    { value: '', label: brandId ? 'Selecciona una categoría' : 'Selecciona primero una marca' },
    ...filteredCategories.map((c) => ({ value: c.id, label: c.name })),
  ]

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert variant="error" message={error} />}

        <FormSection
          title="Identificación"
          description="Nombre, slug, SKU y marca del producto."
        >
          <Input
            id="name"
            label="Nombre"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="Ej. Crema hidratante premium"
          />
          <Input
            id="slug"
            label="Slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            required
            hint="Solo letras minúsculas, números y guiones. Único por marca."
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="brand_id"
              label="Marca"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              options={brandOptions}
              required
            />
            <Select
              id="category_id"
              label="Categoría principal"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categoryOptions}
              required
              disabled={!brandId}
            />
          </div>

          {brandId && (
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-slate-800">
                Categorías adicionales
              </legend>
              <p className="text-xs text-slate-500">
                Opcional. El producto aparecerá también en estas categorías (tienda y filtros). No
                incluyas la principal.
              </p>
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                {filteredCategories.filter((c) => c.id !== categoryId).length === 0 ? (
                  <p className="text-xs text-slate-400">No hay más categorías para esta marca.</p>
                ) : (
                  filteredCategories
                    .filter((c) => c.id !== categoryId)
                    .map((c) => (
                      <label
                        key={c.id}
                        className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={extraCategoryIds.includes(c.id)}
                          onChange={() => {
                            setExtraCategoryIds((prev) =>
                              prev.includes(c.id)
                                ? prev.filter((x) => x !== c.id)
                                : [...prev, c.id],
                            )
                          }}
                          className="size-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                        {c.name}
                      </label>
                    ))
                )}
              </div>
            </fieldset>
          )}

          <Input
            id="sku"
            label="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="MP-001"
            hint="Código interno único (opcional)."
          />
        </FormSection>

        <FormSection
          title="Descripciones"
          description="Texto que verá el cliente en listados y ficha de producto."
        >
          <Input
            id="short_description"
            label="Descripción corta"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Resumen de una línea para listados."
          />
          <Textarea
            id="description"
            label="Descripción completa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción detallada del producto..."
            rows={5}
          />
        </FormSection>

        <FormSection
          title="Precios"
          description="Precio de venta vigente y precio de lista (tachado) opcional."
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price"
              type="number"
              label="Precio de venta"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min={0}
              step="0.01"
              placeholder="0.00"
              hint="Precio que paga el cliente."
            />
            <Input
              id="compare_at_price"
              type="number"
              label="Precio de lista (opcional)"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              min={0}
              step="0.01"
              placeholder="0.00"
              hint="Se muestra tachado si es mayor al precio."
            />
          </div>
        </FormSection>

        <FormSection
          title="Imagen principal"
          description="Foto de portada que aparece en listados. Súbela directamente desde tu PC."
        >
          <ImageUploader
            value={primaryImageUrl}
            onChange={setPrimaryImageUrl}
            label="Imagen principal"
            hint={
              isEditing
                ? 'Haz clic o arrastra para cambiar la imagen principal.'
                : 'Puedes subir la imagen ahora o después de crear el producto.'
            }
            folder="distribuidora/products/primary"
          />
        </FormSection>

        <FormSection title="Visibilidad" description="Controla si el producto aparece en la tienda.">
          <Toggle
            id="is_active"
            checked={isActive}
            onChange={setIsActive}
            label={isActive ? 'Producto activo (visible en tienda)' : 'Producto inactivo (oculto)'}
          />
        </FormSection>

        <div className="flex items-center justify-between">
          {isEditing && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 size={15} />
              Eliminar producto
            </Button>
          )}
          <div className={['flex gap-3', isEditing ? '' : 'ml-auto'].join(' ')}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {isEditing ? 'Guardar cambios' : 'Crear y continuar →'}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showDeleteDialog}
        title="¿Eliminar producto?"
        description={`Se eliminará "${product?.name}" permanentemente. Los ítems de órdenes existentes conservarán los snapshots.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  )
}
