'use client'

import { useState } from 'react'
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
import type { Brand, Category } from '@/types/database'
import { Trash2 } from 'lucide-react'

interface CategoryFormProps {
  category?: Category
  brands: Pick<Brand, 'id' | 'name'>[]
}

export function CategoryForm({ category, brands }: CategoryFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!category

  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? '')
  const [brandId, setBrandId] = useState(category?.brand_id ?? '')
  const [isActive, setIsActive] = useState(category?.is_active ?? true)
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0)

  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)

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
    setLoading(true)

    const payload = {
      name: name.trim(),
      slug,
      description: description.trim() || null,
      image_url: imageUrl.trim() || null,
      brand_id: brandId || null,
      is_active: isActive,
      sort_order: sortOrder,
    }

    const { error: dbError } = isEditing
      ? await supabase.from('categories').update(payload as never).eq('id', category.id)
      : await supabase.from('categories').insert(payload as never)

    setLoading(false)

    if (dbError) {
      if (dbError.message.includes('categories_slug')) {
        setError('Ya existe una categoría con ese slug en este contexto.')
      } else {
        setError(dbError.message)
      }
      return
    }

    router.push('/admin/categorias')
    router.refresh()
  }

  async function handleDelete() {
    setDeleting(true)
    const { error: dbError } = await supabase
      .from('categories')
      .delete()
      .eq('id', category!.id)
    setDeleting(false)
    setShowDeleteDialog(false)

    if (dbError) {
      setError('No se puede eliminar esta categoría porque tiene productos asociados.')
      return
    }

    router.push('/admin/categorias')
    router.refresh()
  }

  const brandOptions = [
    { value: '', label: 'Global (sin marca)' },
    ...brands.map((b) => ({ value: b.id, label: b.name })),
  ]

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert variant="error" message={error} />}

        <FormSection
          title="Información general"
          description="Nombre, slug y descripción de la categoría."
        >
          <Input
            id="name"
            label="Nombre"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="Ej. Belleza"
          />
          <Input
            id="slug"
            label="Slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            required
            placeholder="belleza"
            hint="Solo letras minúsculas, números y guiones."
          />
          <Textarea
            id="description"
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción opcional..."
            rows={3}
          />
        </FormSection>

        <FormSection
          title="Imagen de presentación"
          description="Imagen vertical que se muestra en el home y el listado de categorías."
        >
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            label="Imagen de la categoría"
            hint="Formato vertical 3:4 recomendado. JPG, PNG o WebP."
            folder="distribuidora/categories"
            aspectRatio="portrait"
          />
        </FormSection>

        <FormSection
          title="Alcance"
          description="Define si es global o pertenece a una marca específica."
        >
          <Select
            id="brand_id"
            label="Marca (alcance)"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            options={brandOptions}
            hint="'Global' significa que aparece en toda la tienda."
          />
        </FormSection>

        <FormSection
          title="Configuración"
          description="Visibilidad y orden en la tienda."
        >
          <Toggle
            id="is_active"
            checked={isActive}
            onChange={setIsActive}
            label={isActive ? 'Categoría activa (visible)' : 'Categoría inactiva (oculta)'}
          />
          <Input
            id="sort_order"
            type="number"
            label="Orden de aparición"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            min={0}
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
              Eliminar
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
              {isEditing ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showDeleteDialog}
        title="¿Eliminar categoría?"
        description={`Se eliminará "${category?.name}" permanentemente. Los productos de esta categoría no podrán eliminarse mientras existan.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  )
}
