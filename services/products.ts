import { createSupabaseClient } from '@/lib/supabase'
import { mapProduct, productToRow, type Product, type ProductInput } from '@/lib/products'

const table = 'products'

export async function getProducts(activeOnly = false): Promise<Product[]> {
  const supabase = createSupabaseClient()
  let query = supabase.from(table).select('*').order('updated_at', { ascending: false })
  if (activeOnly) query = query.eq('active', true)
  const { data, error } = await query
  if (error) throw error
  return data.map(mapProduct)
}

export async function createProduct(input: ProductInput) {
  const { data, error } = await createSupabaseClient().from(table).insert(productToRow(input)).select().single()
  if (error) throw error
  return mapProduct(data)
}

export async function updateProduct(id: string, input: ProductInput) {
  const { data, error } = await createSupabaseClient().from(table).update(productToRow(input)).eq('id', id).select().single()
  if (error) throw error
  return mapProduct(data)
}

export async function deleteProduct(id: string) {
  const { error } = await createSupabaseClient().from(table).delete().eq('id', id)
  if (error) throw error
}

export async function uploadProductImage(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `products/${crypto.randomUUID()}.${extension}`
  const supabase = createSupabaseClient()
  const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false, contentType: file.type })
  if (error) throw error
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
}

export async function removeProductImage(imageUrl: string | null) {
  if (!imageUrl) return
  const marker = '/product-images/'
  const index = imageUrl.indexOf(marker)
  if (index === -1) return
  await createSupabaseClient().storage.from('product-images').remove([imageUrl.slice(index + marker.length)])
}
