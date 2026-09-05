import { createSupabaseClient } from '@/lib/supabase'

export type Taxonomy = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

type Kind = 'categories' | 'essences'
export async function getTaxonomies(kind: Kind): Promise<Taxonomy[]> {
  const { data, error } = await createSupabaseClient().from(kind).select('*').order('name')
  if (error) throw error
  return data.map((item) => ({ id: item.id, name: item.name, createdAt: item.created_at, updatedAt: item.updated_at }))
}

export async function createTaxonomy(kind: Kind, name: string) {
  const { data, error } = await createSupabaseClient().from(kind).insert({ name: name.trim() }).select().single()
  if (error) throw error
  return { id: data.id, name: data.name, createdAt: data.created_at, updatedAt: data.updated_at } as Taxonomy
}

export async function updateTaxonomy(kind: Kind, item: Taxonomy, name: string) {
  const normalized = name.trim()
  const supabase = createSupabaseClient()
  const { data, error } = await supabase.from(kind).update({ name: normalized }).eq('id', item.id).select().single()
  if (error) throw error
  return { id: data.id, name: data.name, createdAt: data.created_at, updatedAt: data.updated_at } as Taxonomy
}

export async function deleteTaxonomy(kind: Kind, item: Taxonomy) {
  const supabase = createSupabaseClient()
  const { error } = await supabase.from(kind).delete().eq('id', item.id)
  if (error) throw new Error(error.code === '23503' ? 'Esta opção está associada a produtos. Altere os produtos antes de excluí-la.' : error.message)
}
