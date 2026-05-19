import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkoutSchema } from '@/lib/validations/checkout'

export async function POST(req: NextRequest) {
  // 1. Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  // 2. Validate with Zod
  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Datos inválidos.'
    return NextResponse.json({ error: firstError }, { status: 422 })
  }

  const { customerName, customerEmail, customerPhone, shippingAddress, customerNotes, items } =
    parsed.data

  const supabase = createAdminClient()

  // 3. Verify products exist and get server-side prices
  const productIds = items.map((i) => i.productId)

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price, compare_at_price, is_active, brand:brands!inner(name)')
    .in('id', productIds)
    .eq('is_active', true)

  if (productsError) {
    console.error('[checkout] products query error:', productsError)
    return NextResponse.json({ error: 'Error interno. Inténtalo de nuevo.' }, { status: 500 })
  }

  const productMap = new Map(
    (products ?? []).map((p) => [p.id, p]),
  )

  // Check all products were found and are active
  for (const item of items) {
    if (!productMap.has(item.productId)) {
      return NextResponse.json(
        { error: `El producto con ID ${item.productId} no está disponible.` },
        { status: 422 },
      )
    }
  }

  // 4. Calculate server-side subtotal
  const lineItems = items.map((item) => {
    const product = productMap.get(item.productId)!
    const brandName = (product.brand as unknown as { name: string } | null)?.name ?? null
    return {
      product_id: item.productId,
      product_name: product.name,
      brand_name: brandName,
      unit_price: product.price,
      list_unit_price: product.compare_at_price ?? null,
      quantity: item.quantity,
      line_total: product.price * item.quantity,
    }
  })

  const subtotal = lineItems.reduce((acc, li) => acc + li.line_total, 0)

  // 5. Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      status: 'pending_contact',
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: shippingAddress ?? null,
      customer_notes: customerNotes ?? null,
      currency: 'MXN',
      subtotal,
    })
    .select('id, order_number')
    .single()

  if (orderError || !order) {
    console.error('[checkout] order insert error:', orderError)
    return NextResponse.json({ error: 'No se pudo crear la orden. Inténtalo de nuevo.' }, { status: 500 })
  }

  // 6. Insert order items
  const { error: itemsError } = await supabase.from('order_items').insert(
    lineItems.map((li) => ({ order_id: order.id, ...li })),
  )

  if (itemsError) {
    console.error('[checkout] order_items insert error:', itemsError)
    // Order was created, log but don't fail — admin can review
  }

  // 7. Build WhatsApp deep-link message for the owner (fallback if no provider)
  const itemsSummary = lineItems
    .map(
      (li) =>
        `• ${li.quantity}x ${li.product_name}${li.brand_name ? ` (${li.brand_name})` : ''} — $${li.line_total.toFixed(2)}`,
    )
    .join('\n')

  const waMessage = encodeURIComponent(
    `🛒 Nueva orden ${order.order_number}\n` +
      `Cliente: ${customerName}\n` +
      `Tel: ${customerPhone}\n` +
      `Email: ${customerEmail}\n` +
      (shippingAddress ? `Dirección: ${shippingAddress}\n` : '') +
      (customerNotes ? `Notas: ${customerNotes}\n` : '') +
      `\nProductos:\n${itemsSummary}\n` +
      `\nTotal: $${subtotal.toFixed(2)} MXN`,
  )

  const waAdminNumber = (process.env.WHATSAPP_ADMIN_E164 ?? '').replace(/\D/g, '')
  const waLink = waAdminNumber
    ? `https://wa.me/${waAdminNumber}?text=${waMessage}`
    : null

  // Log notification attempt
  if (waLink) {
    await supabase.from('notification_logs').insert({
      order_id: order.id,
      channel: 'whatsapp',
      status: 'pending',
      provider_id: null,
      error: null,
    })
  }

  // 8. Respond
  return NextResponse.json(
    {
      orderNumber: order.order_number,
      orderId: order.id,
      subtotal,
      waLink,
    },
    { status: 201 },
  )
}
