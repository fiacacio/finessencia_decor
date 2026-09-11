import { createSupabaseClient } from '@/lib/supabase'
import { defaultAnnouncement, validFair, type Announcement } from '@/lib/announcement'

export async function getAnnouncement(): Promise<Announcement> {
  const { data, error } = await createSupabaseClient().from('announcement_settings').select('*').eq('id', 1).single()
  if (error) throw new Error('Não foi possível carregar a barra superior. Verifique se a configuração foi criada no Supabase.')
  const settings = { ...defaultAnnouncement, ...data } as Announcement
  // Normalize the original event already saved by the first agenda migration.
  settings.fairs = settings.fairs.map((fair) => fair.label === '21 de Novembro/26 - Ubuntu - Meu escritório'
    ? { ...fair, label: '21 de Novembro/26 - Ubuntu' } : fair)
  return settings
}

export async function saveAnnouncement(value: Announcement) {
  const text = value.text.trim()
  if (value.fairs.length > 30 || !value.fairs.every(validFair)) throw new Error('Preencha cada feira com uma descrição e uma data final válida (máximo de 30 feiras).')
  if (!text || text.length > 160 || !/^#[0-9a-f]{6}$/i.test(value.color)) throw new Error('Informe um texto de até 160 caracteres e uma cor válida.')
  const { data, error } = await createSupabaseClient().from('announcement_settings').upsert({ id: 1, ...value, text }).select('*').single()
  if (error) throw new Error('Não foi possível salvar a barra superior. Verifique sua conexão e a configuração no Supabase.')
  return data as Announcement
}
