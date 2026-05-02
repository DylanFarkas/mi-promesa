import { createHash } from 'node:crypto'

/**
 * Genera la firma para un upload firmado a Cloudinary.
 * Los parámetros se ordenan alfabéticamente y se concatenan antes del api_secret.
 */
export function generateCloudinarySignature(
  params: Record<string, string | number>,
): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')

  return createHash('sha256')
    .update(sorted + process.env.CLOUDINARY_API_SECRET!)
    .digest('hex')
}

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
