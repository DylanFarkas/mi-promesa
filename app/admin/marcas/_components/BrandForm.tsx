'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'
import { Alert } from '@/components/ui/Alert'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { FormSection } from '@/components/admin/FormSection'
import { generateSlug } from '@/lib/utils'
import type { Brand } from '@/types/database'
import { Trash2 } from 'lucide-react'

interface BrandFormProps {
  brand?: Brand
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!brand

  const [name, setName] = useState(brand?.name ?? '')
  const [slug, setSlug] = useState(brand?.slug ?? '')
  const [description, setDescription] = useState(brand?.description ?? '')
  const [isActive, setIsActive] = useState(brand?.is_active ?? true)
  const [sortOrder, setSortOrder] = useState(brand?.sort_order ?? 0)

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
      is_active: isActive,
      sort_order: sortOrder,
    }

    const { error: dbError } = isEditing
      ? await supabase.from('brands').update(payload as never).eq('id', brand.id)
      : await supabase.from('brands').insert(payload as never)

    setLoading(false)

    if (dbError) {
      if (dbError.message.includes('brands_slug')) {
        setError('Ya existe una marca con ese slug. Elige otro.')
      } else {
        setError(dbError.message)
      }
      return
    }

    router.push('/admin/marcas')
    router.refresh()
  }

  async function handleDelete() {
    setDeleting(true)
    const { error: dbError } = await supabase
      .from('brands')
      .delete()
      .eq('id', brand!.id)
    setDeleting(false)
    setShowDeleteDialog(false)

    if (dbError) {
      setError(
        'No se puede eliminar esta marca porque tiene productos o categorías asociadas.',
      )
      return
    }

    router.push('/admin/marcas')
    router.refresh()
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert variant="error" message={error} />}

        <FormSection
          title="Información general"
          description="Nombre, slug e identificación de la marca."
        >
          <Input
            id="name"
            label="Nombre"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="Ej. Aura Reserve"
          />
          <Input
            id="slug"
            label="Slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            required
            placeholder="aura-reserve"
            hint="URL amigable. Solo letras minúsculas, números y guiones."
          />
          <Textarea
            id="description"
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción breve de la marca..."
            rows={3}
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
            label={isActive ? 'Marca activa (visible)' : 'Marca inactiva (oculta)'}
          />
          <Input
            id="sort_order"
            type="number"
            label="Orden de aparición"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            min={0}
            hint="Menor número aparece primero."
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
              Eliminar marca
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
              {isEditing ? 'Guardar cambios' : 'Crear marca'}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showDeleteDialog}
        title="¿Eliminar marca?"
        description={`Se eliminará "${brand?.name}" permanentemente. Esta acción no se puede deshacer. Asegúrate de que no tenga productos o categorías.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  )
}
