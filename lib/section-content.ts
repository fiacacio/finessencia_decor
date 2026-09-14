import type { CSSProperties } from 'react'
import { sectionColorProps, type SectionColors, type SectionId } from '@/lib/section-colors'

type Field = { key: string; label: string; defaultValue: string }
export const sectionFields: Partial<Record<SectionId, Field[]>> = {
  hero: [{ key: 'subtitle', label: 'Subtítulo', defaultValue: 'DECOR AROMÁTICO' }, { key: 'title', label: 'Título', defaultValue: 'ACENDA\nO MOMENTO' }, { key: 'text', label: 'Texto', defaultValue: 'ESSÊNCIAS QUE TRANSFORMAM\nAMBIENTES EM MEMÓRIAS.' }, { key: 'button', label: 'Texto do botão', defaultValue: 'CONHEÇA A COLEÇÃO' }],
  welcome: [{ key: 'subtitle', label: 'Subtítulo (opcional)', defaultValue: '' }, { key: 'title', label: 'Título', defaultValue: 'BEM-VINDA À FINESSÊNCIA' }, { key: 'text', label: 'Texto', defaultValue: 'Uma pausa para sentir, acolher e transformar. Criamos aromas e detalhes que fazem de cada ambiente um lugar ainda mais seu.' }],
  arrivals: [{ key: 'subtitle', label: 'Subtítulo', defaultValue: 'NOSSAS ESSÊNCIAS' }, { key: 'title', label: 'Título', defaultValue: 'ESCOLHAS PARA SENTIR' }, { key: 'text', label: 'Texto de apresentação (opcional)', defaultValue: '' }],
  showcase: [{ key: 'subtitle', label: 'Subtítulo', defaultValue: 'CATEGORIAS' }, { key: 'title', label: 'Título', defaultValue: 'ENCONTRE O SEU RITUAL' }, { key: 'text', label: 'Texto de apresentação (opcional)', defaultValue: '' }],
  catalog: [{ key: 'subtitle', label: 'Subtítulo', defaultValue: 'MOSTRUÁRIO' }, { key: 'title', label: 'Título', defaultValue: 'ESCOLHA SEU PRODUTO' }, { key: 'text', label: 'Texto de apresentação (opcional)', defaultValue: '' }],
  story: [{ key: 'subtitle', label: 'Subtítulo', defaultValue: 'NOSSA HISTÓRIA' }, { key: 'title', label: 'Título', defaultValue: 'Toda história tem uma origem. E a nossa começa aqui.' }, { key: 'text', label: 'Texto', defaultValue: 'Somos três mulheres unidas pelo amor, pelo cuidado e pelo desejo de levar bem-estar para a vida das pessoas.' }, { key: 'text2', label: 'Segundo parágrafo', defaultValue: 'Eu, Laura, ao lado da minha mãe Kerli e irmã Maria Clara, damos vida à Finessência: uma marca que nasceu do coração, da conexão com a natureza e da crença de que pequenos momentos podem transformar os nossos dias.' }, { key: 'text3', label: 'Mensagem final', defaultValue: 'Sejam muito bem-vindos à nossa essência. Que este seja um espaço de acolhimento, leveza e boas energias.' }],
  about: [{ key: 'subtitle', label: 'Subtítulo', defaultValue: 'NOSSA ESSÊNCIA' }, { key: 'title', label: 'Título', defaultValue: 'Feito para transformar ambientes em momentos.' }, { key: 'text', label: 'Texto', defaultValue: 'Na Finessência, cada criação une fragrâncias marcantes, beleza e delicadeza. São detalhes artesanais pensados para acolher a rotina e criar memórias afetivas.' }],
  footer: [{ key: 'text', label: 'Mensagem', defaultValue: 'Feito com delicadeza para o seu momento.' }],
}
export const sectionFonts = [{ name: 'Original', value: '' }, { name: 'Italiana', value: 'Italiana, Georgia, serif' }, { name: 'Montserrat', value: 'Montserrat, Arial, sans-serif' }, { name: 'Georgia', value: 'Georgia, serif' }, { name: 'Arial', value: 'Arial, Helvetica, sans-serif' }]
export type SectionContent = Partial<Record<SectionId, Record<string, string>>>
export function normalizeSectionContent(value: unknown): SectionContent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const result: SectionContent = {}
  for (const [id, values] of Object.entries(value)) {
    if (!sectionFields[id as SectionId] || !values || typeof values !== 'object' || Array.isArray(values)) continue
    const saved: Record<string, string> = {}
    for (const [key, text] of Object.entries(values)) {
      if (typeof text !== 'string') continue
      if ((key === 'titleFont' || key === 'bodyFont') && sectionFonts.some(font => font.value === text)) saved[key] = text
      else if (key === 'textColor' && (/^#[0-9a-f]{6}$/i.test(text) || text === '')) saved[key] = text
      else if (sectionFields[id as SectionId]?.some(field => field.key === key) && text.length <= 3000) saved[key] = text
    }
    result[id as SectionId] = saved
  }
  return result
}
export const sectionText = (content: SectionContent, id: SectionId, key: string) => content[id]?.[key] ?? sectionFields[id]?.find(field => field.key === key)?.defaultValue ?? ''
export function sectionProps(colors: SectionColors, content: SectionContent, id: SectionId) {
  const base = sectionColorProps(colors, id), settings = content[id] || {}
  return { ...base, 'data-content-section': id, style: { ...base.style, ...(settings.titleFont ? { '--section-title-font': settings.titleFont } : {}), ...(settings.bodyFont ? { '--section-body-font': settings.bodyFont } : {}), ...(settings.textColor ? { '--section-text-color': settings.textColor } : {}) } as CSSProperties }
}
