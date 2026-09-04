import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)

export const createSupabaseClient = () => {
  if (!url || !key) throw new Error('Supabase não configurado. Adicione as variáveis de ambiente.')
  return createClient(url, key)
}
