'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
  hint?: string
  folder?: string
  /** Aspecto de la previsualización, por defecto cuadrado */
  aspectRatio?: 'square' | 'wide' | 'portrait'
}

export function ImageUploader({
  value,
  onChange,
  label,
  hint,
  folder = 'distribuidora/products',
  aspectRatio = 'square',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes (JPG, PNG, WebP, etc.)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no puede superar 10 MB.')
      return
    }

    setError(null)
    setUploading(true)

    try {
      // 1. Obtener firma del servidor
      const sigRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      })

      if (!sigRes.ok) throw new Error('No se pudo obtener la firma de subida.')

      const { signature, timestamp, apiKey, cloudName, folder: signedFolder } =
        await sigRes.json()

      // 2. Subir directamente a Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', apiKey)
      formData.append('timestamp', String(timestamp))
      formData.append('signature', signature)
      formData.append('folder', signedFolder)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData },
      )

      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err?.error?.message ?? 'Error al subir la imagen.')
      }

      const data = await uploadRes.json()
      onChange(data.secure_url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado al subir.')
    } finally {
      setUploading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  function handleRemove() {
    onChange('')
    setError(null)
  }

  const previewClass =
    aspectRatio === 'wide'
      ? 'aspect-video w-full max-w-sm'
      : aspectRatio === 'portrait'
        ? 'aspect-3/4 w-full max-w-36'
        : 'h-36 w-36'

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}

      {value ? (
        /* Preview con botón de eliminar */
        <div className={['relative inline-block', previewClass].join(' ')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Vista previa"
            className="h-full w-full rounded-xl object-cover border border-slate-200 shadow-sm"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
            aria-label="Quitar imagen"
          >
            <X size={12} />
          </button>
          {/* Botón para cambiar la imagen */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
          >
            <Upload size={11} />
            Cambiar
          </button>
        </div>
      ) : (
        /* Zona de drop */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={[
            'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed',
            'cursor-pointer transition-colors duration-150 select-none',
            aspectRatio === 'wide'
              ? 'w-full max-w-sm aspect-video'
              : aspectRatio === 'portrait'
                ? 'w-full max-w-36 aspect-3/4'
                : 'h-36 w-36',
            uploading
              ? 'pointer-events-none border-slate-200 bg-slate-50'
              : dragOver
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50',
          ].join(' ')}
        >
          {uploading ? (
            <Loader2 className="animate-spin text-indigo-500" size={24} />
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <ImageIcon className="text-slate-400" size={20} />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-slate-700">
                  {dragOver ? 'Suelta aquí' : 'Subir imagen'}
                </p>
                <p className="text-xs text-slate-400">
                  JPG, PNG, WebP · máx. 10 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {error && (
        <p className="text-xs text-red-600" role="alert">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  )
}
