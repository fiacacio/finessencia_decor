import { createSupabaseClient } from '@/lib/supabase'
import { defaultSpraySettings, type SpraySettings } from '@/lib/spray-settings'

export async function getSpraySettings(): Promise<SpraySettings> {
  const { data, error } = await createSupabaseClient().from('visual_settings').select('*').eq('id', 1).single()
  if (error) throw new Error('Não foi possível carregar as gotículas. Verifique a configuração no Supabase.')
  return { ...defaultSpraySettings, ...data }
}
export async function saveSpraySettings(settings: SpraySettings): Promise<SpraySettings> {
  const { spray_enabled, particle_count, particle_color, particle_opacity } = settings
  if (typeof spray_enabled !== 'boolean' || !Number.isInteger(particle_count) || particle_count < 50 || particle_count > 1500 || !/^#[0-9a-f]{6}$/i.test(particle_color) || !Number.isFinite(particle_opacity) || particle_opacity < 0 || particle_opacity > 100) throw new Error('Verifique a quantidade, a cor e a opacidade.')
  const { data, error } = await createSupabaseClient().from('visual_settings').update({ spray_enabled, particle_count, particle_color, particle_opacity }).eq('id', 1).select('*').single()
  if (error) throw new Error('Não foi possível salvar as gotículas. Verifique a configuração no Supabase e tente novamente.')
  return data
}
