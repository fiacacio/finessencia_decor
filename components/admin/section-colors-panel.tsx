
'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { colorSections, projectPalette, sectionTextColor, type SectionColors, type SectionId } from '@/lib/section-colors'
import { sectionFields, sectionFonts, sectionText, type SectionContent } from '@/lib/section-content'
import { getSectionSettings, saveSectionSettings } from '@/services/section-colors'

export function SectionColorsPanel() {
  const [colors, setColors] = useState<SectionColors>({})
  const [content, setContent] = useState<SectionContent>({})
  const [selected, setSelected] = useState<SectionId>('hero')
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    let active = true
    getSectionSettings().then(value => { if (active) { setColors(value.colors); setContent(value.content); setReady(value.editable); if (!value.editable) setError('Execute o SQL de edição das seções para habilitar os novos controles. Suas cores foram preservadas.') } }).catch(cause => { if (active) setError(cause.message) })
    return () => { active = false }
  }, [])
  const edit = (key: string, value: string) => { setContent(current => ({ ...current, [selected]: { ...current[selected], [key]: value } })); setMessage('') }
  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(''); setMessage('')
    try { await saveSectionSettings(colors, content); setMessage('Seções salvas. As alterações aparecem ao abrir ou atualizar o site.') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.') }
    finally { setSaving(false) }
  }
  const fields = sectionFields[selected] || []
  const config = content[selected] || {}
  return <form className="admin-section-editor" onSubmit={save}>
    {error && <p role="alert">{error}</p>}
    {!ready && !error && <p role="status">Carregando seções...</p>}
    <label>Seção<select className="admin-input" value={selected} onChange={e => setSelected(e.target.value as SectionId)}>{colorSections.map(section => <option key={section.id} value={section.id}>{section.name}</option>)}</select></label>
    <fieldset disabled={!ready || saving}>
      <label>Cor de fundo<select className="admin-input" value={colors[selected] || ''} onChange={e => { const value = e.target.value; setColors(current => { const next = { ...current }; if (value) next[selected] = value; else delete next[selected]; return next }); setMessage('') }}><option value="">Original</option>{projectPalette.map(color => <option key={color.value} value={color.value}>{color.name}</option>)}</select></label>
      {fields.length ? <>
        {fields.map(field => <label key={selected + field.key}>{field.label}<textarea className="admin-input" rows={field.key.startsWith('text') ? 4 : 2} maxLength={3000} value={sectionText(content, selected, field.key)} onChange={e => edit(field.key, e.target.value)} /></label>)}
        <div className="admin-section-fonts">{[['titleFont','Fonte dos títulos'],['bodyFont','Fonte dos textos']].map(([key,label]) => <label key={key}>{label}<select className="admin-input" value={config[key] || ''} onChange={e => edit(key,e.target.value)}>{sectionFonts.map(font => <option key={font.name} value={font.value}>{font.name}</option>)}</select></label>)}</div>
        <label>Cor do texto<input type="color" value={config.textColor || (colors[selected] ? sectionTextColor(colors[selected]!) : '#3a2419')} onChange={e => edit('textColor',e.target.value)} /></label>
        <button type="button" className="admin-secondary" onClick={() => edit('textColor','')}>Usar cor de texto automática</button>
        <div className="admin-section-preview" style={{ background: colors[selected] || '#faf6f0', color: config.textColor || sectionTextColor(colors[selected] || '#faf6f0'), fontFamily: config.bodyFont || 'Montserrat, Arial, sans-serif' }}>
          <small>Prévia do conteúdo e das fontes</small>
          {fields.map(field => field.key === 'title' ? <h2 key={field.key} style={{ fontFamily: config.titleFont || 'Italiana, Georgia, serif' }}>{sectionText(content,selected,field.key)}</h2> : <p key={field.key}>{sectionText(content,selected,field.key)}</p>)}
        </div>
      </> : <p>{selected === 'announcement' ? 'O texto e as feiras são editados na aba Barra superior.' : 'Esta seção usa imagens ou ícones. A cor de fundo pode ser ajustada aqui; fontes não alteram os logos.'}</p>}
      <div className="admin-colors-actions">
        <button type="button" className="admin-secondary" onClick={() => { setColors(current => { const next = { ...current }; delete next[selected]; return next }); setContent(current => { const next = { ...current }; delete next[selected]; return next }); setMessage('Padrões restaurados nesta seção. Salve para publicar.') }}>Restaurar esta seção</button>
        <button className="admin-button">{saving ? 'Salvando...' : 'Salvar seções'}</button>
      </div>
    </fieldset>
    {message && <p role="status">{message}</p>}
  </form>
}
