import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)

let client: SupabaseClient | undefined

export const createSupabaseClient = () => {
  if (!url || !key) throw new Error('Supabase não configurado. Adicione as variáveis de ambiente.')
  client ??= createClient(url, key)
  return client
}
