import { z } from 'zod'

export const checkoutItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
})

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'El nombre es obligatorio').max(120),
  customerEmail: z.string().email('Ingresa un email válido'),
  customerPhone: z
    .string()
    .min(8, 'El teléfono es obligatorio')
    .max(20)
    .regex(/^[+\d\s\-()]+$/, 'Solo números, espacios y + - ()'),
  shippingAddress: z.string().max(300).optional(),
  customerNotes: z.string().max(500).optional(),
  items: z
    .array(checkoutItemSchema)
    .min(1, 'El carrito está vacío'),
})

export type CheckoutPayload = z.infer<typeof checkoutSchema>
