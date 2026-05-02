import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateCloudinarySignature } from '@/lib/cloudinary'

/**
 * POST /api/upload
 * Devuelve los parámetros firmados para un upload directo a Cloudinary.
 * Solo usuarios admin autenticados pueden obtener estas firmas.
 */
export async function POST(request: NextRequest) {
  // Verificar sesión de admin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const folder: string = body.folder ?? 'distribuidora/products'

  const timestamp = Math.round(Date.now() / 1000)

  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  }

  const signature = generateCloudinarySignature(paramsToSign)

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  })
}
