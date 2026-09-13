import { createSupabaseClient } from '@/lib/supabase'
import { defaultTaxonomyImages, type TaxonomyKind } from '@/lib/taxonomy-images'

export type Taxonomy = { id: string; name: string; imageUrl: string | null; hoverImageUrl: string | null; createdAt: string; updatedAt: string }
export type TaxonomyInput = { name: string; imageUrl: string | null; hoverImageUrl: string | null }
type Row = { id: string; name: string; image_url?: string | null; hover_image_url?: string | null; created_at: string; updated_at: string }
function mapTaxonomy(kind: TaxonomyKind, row: Row): Taxonomy {
  const original = defaultTaxonomyImages(kind, row.name)
  return { id:row.id, name:row.name, imageUrl:row.image_url === undefined ? original?.image || null : row.image_url,
    hoverImageUrl:row.hover_image_url === undefined ? original?.hoverImage || null : row.hover_image_url,
    createdAt:row.created_at, updatedAt:row.updated_at }
}
function toRow(input: TaxonomyInput) {
  if (!input.name.trim()) throw new Error('Informe o nome do cadastro.')
  return { name:input.name.trim(), image_url:input.imageUrl, hover_image_url:input.hoverImageUrl }
}
export async function getTaxonomies(kind: TaxonomyKind): Promise<Taxonomy[]> {
  const { data, error } = await createSupabaseClient().from(kind).select('*').order('created_at').order('id')
  if (error) throw error
  return data.map((item) => mapTaxonomy(kind,item))
}
export async function createTaxonomy(kind: TaxonomyKind, input: TaxonomyInput) {
  const { data, error } = await createSupabaseClient().from(kind).insert(toRow(input)).select().single()
  if (error) throw error
  return mapTaxonomy(kind,data)
}
export async function updateTaxonomy(kind: TaxonomyKind, item: Taxonomy, input: TaxonomyInput) {
  const { data, error } = await createSupabaseClient().from(kind).update(toRow(input)).eq('id', item.id).select().single()
  if (error) throw error
  return mapTaxonomy(kind,data)
}
export async function deleteTaxonomy(kind: TaxonomyKind, item: Taxonomy) {
  const supabase = createSupabaseClient()
  const query = kind === 'categories' ? supabase.from('products').select('id', {count:'exact',head:true}).eq('category_id',item.id)
    : supabase.from('product_essences').select('product_id', {count:'exact',head:true}).eq('essence_id',item.id)
  const {count,error:countError} = await query
  if (countError) throw countError
  if (count) throw new Error('Não é possível excluir um cadastro associado a produtos.')
  const {error} = await supabase.from(kind).delete().eq('id',item.id)
  if (error) throw error
}
