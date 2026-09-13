import type { CSSProperties } from 'react'

export const projectPalette = [
  { name: 'Creme', value: '#faf6f0' }, { name: 'Bege', value: '#f3e9dd' },
  { name: 'Caramelo', value: '#ca8a4a' }, { name: 'Cobre', value: '#a75e2b' },
  { name: 'Marrom', value: '#3a2419' }, { name: 'Sálvia', value: '#7a8a74' },
] as const
export const colorSections = [
  { id: 'announcement', name: 'Barra superior' }, { id: 'header', name: 'Cabeçalho' },
  { id: 'hero', name: 'Abertura' }, { id: 'welcome', name: 'Boas-vindas' },
  { id: 'arrivals', name: 'Nossas essências' }, { id: 'showcase', name: 'Categorias' },
  { id: 'catalog', name: 'Mostruário' }, { id: 'story', name: 'Nossa história' },
  { id: 'about', name: 'Nossa essência' }, { id: 'brand', name: 'Marca antes do rodapé' },
  { id: 'footer', name: 'Rodapé' },
] as const
export type SectionId = typeof colorSections[number]['id']
export type SectionColors = Partial<Record<SectionId, string>>
export function normalizeSectionColors(value: unknown): SectionColors {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const record = value as Record<string, unknown>
  return Object.fromEntries(colorSections.flatMap(({ id }) => projectPalette.some((color) => color.value === record[id]) ? [[id, record[id]]] : [])) as SectionColors
}
export function sectionTextColor(background: string) {
  const channels = [1, 3, 5].map((offset) => {
    const channel = parseInt(background.slice(offset, offset + 2), 16) / 255
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4
  })
  const luminance = channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722
  return luminance > .179 ? '#000000' : '#ffffff'
}
export function sectionColorProps(colors: SectionColors, id: SectionId) {
  const background = colors[id]
  return background ? { 'data-section-color': true, style: { '--section-bg': background, '--section-fg': sectionTextColor(background) } as CSSProperties } : {}
}