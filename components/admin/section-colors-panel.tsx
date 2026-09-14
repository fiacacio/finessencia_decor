'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import { colorSections, projectPalette, sectionTextColor, type SectionColors, type SectionId } from '@/lib/section-colors'
import { sectionFields, sectionFonts, sectionText, type SectionContent } from '@/lib/section-content'
import { getSectionSettings, saveSectionSettings } from '@/services/section-colors'

export function SectionColorsPanel() {
  const [colors, setColors] = useState<SectionColors>({}), [content, setContent] = useState<SectionContent>({})
  const [open, setOpen] = useState<SectionId | null>('hero'), [ready, setReady] = useState(false), [saving, setSaving] = useState(false)
  const [error, setError] = useState(''), [message, setMessage] = useState('')
  useEffect(() => { let active = true; getSectionSettings().then(value => { if (active) { setColors(value.colors); setContent(value.content); setReady(value.editable); if (!value.editable) setError('Execute o SQL de edição das seções para habilitar estes controles.') } }).catch(cause => active && setError(cause.message)); return () => { active = false } }, [])
  const setColor = (id: SectionId, value: string) => setColors(current => { const next = { ...current }; if (value) next[id] = value; else delete next[id]; return next })
  const edit = (id: SectionId, key: string, value: string) => setContent(current => ({ ...current, [id]: { ...current[id], [key]: value } }))
  async function save(event: FormEvent) { event.preventDefault(); setSaving(true); setError(''); try { await saveSectionSettings(colors, content); setMessage('Seções salvas. Atualize o site para visualizar.') } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.') } finally { setSaving(false) } }
  return <form className="admin-section-editor" onSubmit={save}>
    {error && <p role="alert">{error}</p>}{!ready && !error && <p role="status">Carregando seções...</p>}
    <fieldset className="admin-section-list" disabled={!ready || saving}>{colorSections.map(section => {
      const id = section.id, expanded = open === id, fields = (sectionFields[id] || []).filter(field => !(id === 'hero' && field.key === 'title')), config = content[id] || {}
      return <article className={`admin-section-item${expanded ? ' is-open' : ''}`} key={id}>
        <button className="admin-section-trigger" type="button" onClick={() => setOpen(expanded ? null : id)} aria-expanded={expanded}><span><strong>{section.name}</strong><small>{colors[id] ? projectPalette.find(color => color.value === colors[id])?.name : 'Visual original'}</small></span><ChevronDown size={18} /></button>
        {expanded && <div className="admin-section-inline">
          <div className="admin-palette" role="group" aria-label={`Cor de fundo de ${section.name}`}><span>Cor de fundo</span><div>{[{ name: 'Original', value: '' }, ...projectPalette].map(color => <button key={color.name} className={`admin-color-dot${colors[id] === color.value ? ' is-selected' : ''}${!color.value ? ' is-original' : ''}`} type="button" title={color.name} aria-label={color.name} aria-pressed={colors[id] === color.value} onClick={() => setColor(id, color.value)}><i style={color.value ? { background: color.value } : undefined} /></button>)}</div></div>
          {fields.map(field => <label key={field.key}>{field.label}<textarea className="admin-input" rows={field.key.startsWith('text') ? 3 : 2} maxLength={3000} value={sectionText(content, id, field.key)} onChange={event => edit(id, field.key, event.target.value)} /></label>)}
          {fields.length > 0 && <div className="admin-section-inline-options"><label>Fonte dos títulos<select className="admin-input" value={config.titleFont || ''} onChange={event => edit(id, 'titleFont', event.target.value)}>{sectionFonts.map(font => <option key={font.name} value={font.value}>{font.name}</option>)}</select></label><label>Fonte dos textos<select className="admin-input" value={config.bodyFont || ''} onChange={event => edit(id, 'bodyFont', event.target.value)}>{sectionFonts.map(font => <option key={font.name} value={font.value}>{font.name}</option>)}</select></label><label>Cor do texto<input type="color" value={config.textColor || (colors[id] ? sectionTextColor(colors[id]!) : '#3a2419')} onChange={event => edit(id, 'textColor', event.target.value)} /></label></div>}
          <button className="admin-text-button" type="button" onClick={() => { setColor(id, ''); setContent(current => { const next = { ...current }; delete next[id]; return next }) }}>Restaurar esta seção</button>
        </div>}
      </article>
    })}</fieldset>
    <div className="admin-colors-actions"><button className="admin-button" disabled={!ready || saving}>{saving ? 'Salvando...' : 'Salvar seções'}</button></div>{message && <p role="status">{message}</p>}
  </form>
}
