import { createSupabaseClient } from '@/lib/supabase'
import { normalizeSectionColors, type SectionColors } from '@/lib/section-colors'

export async function getSectionColors(): Promise<SectionColors> {
  const { data, error } = await createSupabaseClient().from('section_color_settings').select('colors').eq('id', 1).single()
  if (error) throw new Error('Não foi possível carregar as cores. Verifique se a configuração de cores foi criada no Supabase.')
  return normalizeSectionColors(data.colors)
}
export async function saveSectionColors(colors: SectionColors): Promise<SectionColors> {
  const normalized = normalizeSectionColors(colors)
  if (Object.keys(colors).length !== Object.keys(normalized).length) throw new Error('Escolha apenas cores da paleta do projeto.')
  const { data, error } = await createSupabaseClient().from('section_color_settings').update({ colors: normalized }).eq('id', 1).select('colors').single()
  if (error) throw new Error('Não foi possível salvar as cores. Verifique sua conexão e tente novamente.')
  return normalizeSectionColors(data.colors)
}