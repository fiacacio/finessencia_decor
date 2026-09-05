import { createSupabaseClient } from '@/lib/supabase'
import { mapProduct, productToRow, type Product, type ProductInput } from '@/lib/products'

const table = 'products'
const selection = '*, category:categories!category_id(id, name), product_essences(essence:essences(id, name))'

export async function getProducts(activeOnly = false): Promise<Product[]> {
  const supabase = createSupabaseClient()
  let query = supabase.from(table).select(selection).order('updated_at', { ascending: false })
  if (activeOnly) query = query.eq('active', true)
  const { data, error } = await query
  if (error) throw error
  return data.map(mapProduct)
}

async function saveProduct(id: string | null, input: ProductInput): Promise<Product> {
  const payload = productToRow(input)
  const supabase = createSupabaseClient()
  const { data: productId, error } = await supabase.rpc('save_product', { p_id: id, p_input: payload })
  if (error) throw new Error(error.message)
  const { data, error: readError } = await supabase.from(table).select(selection).eq('id', productId).single()
  if (readError) throw new Error(readError.message)
  return mapProduct(data)
}
export const createProduct = (input: ProductInput) => saveProduct(null, input)
export const updateProduct = (id: string, input: ProductInput) => saveProduct(id, input)

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
