'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { colorSections, projectPalette, sectionTextColor, type SectionColors, type SectionId } from '@/lib/section-colors'
import { getSectionColors, saveSectionColors } from '@/services/section-colors'

export function SectionColorsPanel() {
  const [colors, setColors] = useState<SectionColors>({})
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    let active = true
    getSectionColors().then((value) => { if (active) { setColors(value); setReady(true) } }).catch((cause) => { if (active) setError(cause.message) })
    return () => { active = false }
  }, [])
  function choose(id: SectionId, value: string) {
    setColors((previous) => { const next = { ...previous }; if (value) next[id] = value; else delete next[id]; return next })
    setMessage('')
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(''); setMessage('')
    try { setColors(await saveSectionColors(colors)); setMessage('Cores salvas. As alterações aparecem ao abrir ou atualizar o site.') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.') }
    finally { setSaving(false) }
  }
  return <form className="admin-section-colors" onSubmit={save}>
    <p>Escolha a cor de fundo de cada seção. O texto se adapta para manter a leitura. “Original” mantém o visual atual; na barra superior, usa a cor definida na aba Barra superior.</p>
    {error && <p role="alert">{error}</p>}
    {!ready && !error && <p role="status">Carregando cores...</p>}
    <fieldset disabled={!ready || saving} className="admin-colors-fields">
      <div className="admin-colors-grid">{colorSections.map(({ id, name }) => <fieldset key={id} className="admin-color-card">
        <legend>{name}</legend>
        <div className="admin-color-preview" style={{ background: colors[id] || '#faf6f0', color: sectionTextColor(colors[id] || '#faf6f0') }}><strong>{name}</strong><span>{colors[id] ? projectPalette.find((color) => color.value === colors[id])?.name : 'Visual original preservado'}</span></div>
        <div className="admin-color-options">{[{ name: 'Original', value: '' }, ...projectPalette].map((color) => <label key={color.name}>
          <input type="radio" name={`color-${id}`} value={color.value} checked={(colors[id] || '') === color.value} onChange={() => choose(id, color.value)} />
          <span className="admin-color-swatch" style={{ background: color.value || 'linear-gradient(135deg, #faf6f0 50%, #a75e2b 50%)' }} aria-hidden="true" />{color.name}
        </label>)}</div>
      </fieldset>)}</div>
      <div className="admin-colors-actions"><button type="button" className="admin-secondary" onClick={() => { setColors({}); setMessage('') }}>Restaurar cores originais</button><button className="admin-button" type="submit">{saving ? 'Salvando...' : 'Salvar cores'}</button></div>
    </fieldset>
    {message && <p role="status">{message}</p>}
  </form>
}