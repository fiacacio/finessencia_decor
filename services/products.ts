import { createSupabaseClient } from '@/lib/supabase'
import { mapProduct, productToRow, type Product, type ProductInput } from '@/lib/products'

const table = 'products'
const productSelect = '*,categories(id,name),product_essences(essences(id,name))'

export async function getProducts(activeOnly = false): Promise<Product[]> {
  const supabase = createSupabaseClient()
  let query = supabase.from(table).select(productSelect).order('updated_at', { ascending: false })
  if (activeOnly) query = query.eq('active', true)
  const { data, error } = await query
  if (error) throw error
  return data.map(mapProduct)
}

async function saveProduct(id: string | null, input: ProductInput) {
  if (!input.name.trim() || !Number.isFinite(input.price) || input.price < 0) throw new Error('Informe um nome e um preço válido.')
  const { data, error } = await createSupabaseClient().rpc('admin_save_product', { p_id:id, p_product:productToRow(input), p_essence_ids:input.allEssences ? [] : input.essenceIds })
  if (error) throw error
  return mapProduct(data)
}
export async function createProduct(input: ProductInput) { return saveProduct(null,input) }
export async function updateProduct(id: string, input: ProductInput) { return saveProduct(id,input) }
export async function setProductActive(id: string, active: boolean) {
  const { data, error } = await createSupabaseClient().from(table).update({active}).eq('id',id).select(productSelect).single()
  if (error) throw error
  return mapProduct(data)
}

export async function deleteProduct(id: string) {
  const { error } = await createSupabaseClient().from(table).delete().eq('id', id)
  if (error) throw error
}

export async function uploadProductImage(file: File) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Selecione uma imagem JPG, PNG ou WEBP de até 5 MB.')
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
