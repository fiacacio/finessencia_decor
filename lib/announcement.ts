export type Fair = { id: string; label: string; endDate: string }
export type Announcement = { visible: boolean; text: string; color: string; marquee: boolean; show_fairs: boolean; fairs: Fair[] }
export const initialFairs: Fair[] = [
  { id: 'outubro-2026', label: '10 de Outubro/26 - Bazar de Quintal - Praça do Oscar Villares', endDate: '2026-10-10' },
  { id: 'novembro-2026', label: '21 de Novembro/26 - Ubuntu', endDate: '2026-11-21' },
  { id: 'dezembro-2026', label: '11, 12 e 13 de Dezembro/26 - Bazer de Quintal - Clube da praça', endDate: '2026-12-13' },
]
export function saoPauloDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}
export function activeFairs(fairs: Fair[], today = saoPauloDate()) {
  return fairs.filter((fair) => fair.endDate >= today && fair.label.trim()).sort((a, b) => a.endDate.localeCompare(b.endDate))
}
export function validFair(fair: Fair) {
  return typeof fair.label === 'string' && fair.label.trim().length > 0 && fair.label.length <= 240 && /^\d{4}-\d{2}-\d{2}$/.test(fair.endDate) && Number.isFinite(Date.parse(fair.endDate)) && new Date(fair.endDate).toISOString().slice(0,10) === fair.endDate
}

export const defaultAnnouncement: Announcement = {
  visible: true,
  marquee: false,
  show_fairs: false,
  fairs: initialFairs,
  text: 'FRETE GRÁTIS PARA PEDIDOS ACIMA DE R$ 199',
  color: '#ca8a4a',
}

export function announcementTextColor(color: string) {
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(color.slice(offset, offset + 2), 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 > 0.179 ? '#000000' : '#ffffff'
}
