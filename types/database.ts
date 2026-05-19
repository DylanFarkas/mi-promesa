export type OrderStatus = 'pending_contact' | 'confirmed' | 'cancelled'
export type NotificationChannel = 'email' | 'whatsapp'
export type NotificationStatus = 'sent' | 'failed' | 'pending'

// ---- Row types (columnas exactas de la DB, sin joins) ----

export interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  brand_id: string | null
  parent_id: string | null
  name: string
  slug: string
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  brand_id: string
  category_id: string
  name: string
  slug: string
  short_description: string | null
  description: string | null
  sku: string | null
  price: number
  compare_at_price: number | null
  is_active: boolean
  primary_image_url: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  sort_order: number
  alt_text: string | null
  created_at: string
}

/** Categorías adicionales; la principal sigue en `products.category_id`. */
export interface ProductCategory {
  product_id: string
  category_id: string
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  status: OrderStatus
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string | null
  customer_notes: string | null
  admin_notes: string | null
  currency: string
  subtotal: number
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  brand_name: string | null
  category_name: string | null
  unit_price: number
  list_unit_price: number | null
  quantity: number
  line_total: number
  created_at: string
}

export interface AdminProfile {
  id: string
  display_name: string | null
  created_at: string
  updated_at: string
}

export interface NotificationLog {
  id: string
  order_id: string | null
  channel: NotificationChannel
  status: NotificationStatus
  provider_id: string | null
  error: string | null
  payload_hash: string | null
  created_at: string
}

// ---- Tipos extendidos con joins (para queries con relaciones) ----

export type BrandOption = Pick<Brand, 'id' | 'name'>
export type CategoryOption = Pick<Category, 'id' | 'name' | 'brand_id'>

export type CategoryWithBrand = Category & {
  brand: BrandOption | null
}

export type ProductWithRelations = Product & {
  brand: BrandOption | null
  category: Pick<Category, 'id' | 'name'> | null
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
}

// ---- Database schema para Supabase generics ----

export type Database = {
  public: {
    PostgrestVersion: '12'
    Tables: {
      brands: {
        Row: Brand
        Insert: Omit<Brand, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Brand, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      product_images: {
        Row: ProductImage
        Insert: Omit<ProductImage, 'id' | 'created_at'>
        Update: Partial<Omit<ProductImage, 'id' | 'created_at'>>
        Relationships: []
      }
      product_categories: {
        Row: ProductCategory
        Insert: Pick<ProductCategory, 'product_id' | 'category_id'>
        Update: Partial<Pick<ProductCategory, 'category_id'>>
        Relationships: []
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id' | 'created_at'>
        Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>
        Relationships: []
      }
      admin_profiles: {
        Row: AdminProfile
        Insert: Omit<AdminProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<AdminProfile, 'id' | 'created_at' | 'updated_at'>>
        Relationships: []
      }
      notification_logs: {
        Row: NotificationLog
        Insert: Omit<NotificationLog, 'id' | 'created_at'>
        Update: Partial<Omit<NotificationLog, 'id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
