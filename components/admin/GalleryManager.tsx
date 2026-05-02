'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import {
  Upload,
  X,
  Loader2,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  GripVertical,
  Plus,
} from 'lucide-react'
import type { ProductImage } from '@/types/database'

interface GalleryManagerProps {
  productId: string
  initialImages: ProductImage[]
}

interface LocalImage extends ProductImage {
  uploading?: boolean
  uploadError?: string
}

export function GalleryManager({ productId, initialImages }: GalleryManagerProps) {
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const tempIdCounter = useRef(0)

  const [images, setImages] = useState<LocalImage[]>(
    [...initialImages].sort((a, b) => a.sort_order - b.sort_order),
  )
  const [saving, setSaving] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  // ─── Upload ────────────────────────────────────────────────────────────────

  async function uploadFile(file: File): Promise<string | null> {
    if (!file.type.startsWith('image/')) return null
    if (file.size > 10 * 1024 * 1024) return null

    const sigRes = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: `distribuidora/products/${productId}` }),
    })
    if (!sigRes.ok) throw new Error('No se pudo obtener la firma de subida.')

    const { signature, timestamp, apiKey, cloudName, folder } = await sigRes.json()

    const fd = new FormData()
    fd.append('file', file)
    fd.append('api_key', apiKey)
    fd.append('timestamp', String(timestamp))
    fd.append('signature', signature)
    fd.append('folder', folder)

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: fd },
    )
    if (!uploadRes.ok) {
      const err = await uploadRes.json()
      throw new Error(err?.error?.message ?? 'Error al subir.')
    }

    const data = await uploadRes.json()
    return data.secure_url as string
  }

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setGlobalError(null)

    const newImages: LocalImage[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      tempIdCounter.current += 1
      const tempId = `temp-${tempIdCounter.current}`
      const placeholder: LocalImage = {
        id: tempId,
        product_id: productId,
        url: '',
        sort_order: images.length + newImages.length,
        alt_text: null,
        created_at: new Date().toISOString(),
        uploading: true,
      }
      newImages.push(placeholder)
    }

    setImages((prev) => [...prev, ...newImages])

    let idx = 0
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const placeholder = newImages[idx]
      idx++

      try {
        const url = await uploadFile(file)
        if (!url) {
          setImages((prev) => prev.filter((i) => i.id !== placeholder.id))
          continue
        }

        // Persistir en DB
        const sortOrder =
          images.filter((i) => !i.uploading).length +
          newImages.filter((n) => !n.uploading && n.url).length

        const { data, error } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            url,
            sort_order: sortOrder,
            alt_text: null,
          } as never)
          .select()
          .single()

        if (error) throw error

        setImages((prev) =>
          prev.map((i) =>
            i.id === placeholder.id ? ({ ...(data as ProductImage) } as LocalImage) : i,
          ),
        )
      } catch {
        setImages((prev) =>
          prev.map((i) =>
            i.id === placeholder.id
              ? { ...i, uploading: false, uploadError: 'Error al subir' }
              : i,
          ),
        )
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, images.length])

  // ─── Delete ────────────────────────────────────────────────────────────────

  async function handleDelete(image: LocalImage) {
    if (image.uploading) return

    // Optimistic update
    setImages((prev) => prev.filter((i) => i.id !== image.id))

    if (!image.id.startsWith('temp-')) {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', image.id)

      if (error) {
        setGlobalError('No se pudo eliminar la imagen.')
        setImages((prev) => [...prev, image].sort((a, b) => a.sort_order - b.sort_order))
      }
    }
  }

  // ─── Reorder ───────────────────────────────────────────────────────────────

  function move(index: number, direction: 'up' | 'down') {
    const newImages = [...images]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newImages.length) return
    ;[newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ]
    setImages(newImages)
  }

  async function saveOrder() {
    setSaving(true)
    setGlobalError(null)

    const updates = images
      .filter((i) => !i.uploading && !i.id.startsWith('temp-'))
      .map((img, idx) => ({ id: img.id, sort_order: idx }))

    const errors: string[] = []
    for (const u of updates) {
      const { error } = await supabase
        .from('product_images')
        .update({ sort_order: u.sort_order } as never)
        .eq('id', u.id)
      if (error) errors.push(u.id)
    }

    setSaving(false)
    if (errors.length > 0) {
      setGlobalError('Algunos cambios de orden no se guardaron.')
    }
  }

  // ─── Drag & Drop zone ──────────────────────────────────────────────────────

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDraggingOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const stableImages = images.filter((i) => !i.uploading && !i.uploadError)
  const hasOrderChanged = stableImages.some((img, idx) => img.sort_order !== idx)

  return (
    <div className="space-y-4">
      {globalError && <Alert variant="error" message={globalError} />}

      {/* Grid de imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={[
                'group relative rounded-xl border overflow-hidden bg-slate-50',
                img.uploading ? 'border-indigo-200' : 'border-slate-200',
              ].join(' ')}
            >
              {/* Imagen */}
              <div className="aspect-square">
                {img.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={img.url}
                    alt={img.alt_text ?? `Imagen ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : img.uploadError ? (
                  <div className="flex h-full items-center justify-center text-red-400">
                    <X size={24} />
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 text-indigo-400">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="text-xs text-slate-500">Subiendo…</span>
                  </div>
                )}
              </div>

              {/* Badge de orden */}
              {!img.uploading && !img.uploadError && (
                <div className="absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white">
                  {idx + 1}
                </div>
              )}

              {/* Controles */}
              {!img.uploading && !img.uploadError && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(idx, 'up')}
                      disabled={idx === 0}
                      className="flex h-6 w-6 items-center justify-center rounded bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-colors"
                      aria-label="Mover arriba"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 'down')}
                      disabled={idx === stableImages.length - 1}
                      className="flex h-6 w-6 items-center justify-center rounded bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-colors"
                      aria-label="Mover abajo"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(img)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                    aria-label="Eliminar imagen"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Grip indicador */}
              {!img.uploading && (
                <div className="absolute top-1.5 right-1.5 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={14} />
                </div>
              )}
            </div>
          ))}

          {/* Celda "añadir" */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true) }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDrop}
            className={[
              'flex aspect-square cursor-pointer flex-col items-center justify-center gap-1',
              'rounded-xl border-2 border-dashed transition-colors duration-150',
              isDraggingOver
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50',
            ].join(' ')}
          >
            <Plus className="text-slate-400" size={22} />
            <span className="text-xs text-slate-500">Añadir</span>
          </div>
        </div>
      )}

      {/* Estado vacío: zona de drop grande */}
      {images.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true) }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          className={[
            'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 cursor-pointer transition-colors',
            isDraggingOver
              ? 'border-indigo-400 bg-indigo-50'
              : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50',
          ].join(' ')}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <ImageIcon className="text-slate-400" size={26} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">
              {isDraggingOver ? 'Suelta las imágenes aquí' : 'Subir imágenes de galería'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Arrastra o haz clic · JPG, PNG, WebP · máx. 10 MB/imagen
            </p>
          </div>
          <div className="flex items-center gap-2 text-indigo-600">
            <Upload size={16} />
            <span className="text-sm font-medium">Seleccionar archivos</span>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Footer: guardar orden */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          {stableImages.length} imagen{stableImages.length !== 1 ? 'es' : ''} ·{' '}
          {hasOrderChanged ? (
            <span className="text-amber-600 font-medium">Orden modificado sin guardar</span>
          ) : (
            'Orden guardado'
          )}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={saveOrder}
          loading={saving}
          disabled={!hasOrderChanged || stableImages.length === 0}
        >
          Guardar orden
        </Button>
      </div>
    </div>
  )
}
