'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { defaultSpraySettings } from '@/lib/spray-settings'
import { getSpraySettings, saveSpraySettings } from '@/services/spray-settings'

export function SpraySettingsPanel() {
  const [settings, setSettings] = useState(defaultSpraySettings)
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    let active = true
    getSpraySettings().then((value) => { if (active) { setSettings(value); setReady(true) } }).catch((cause) => { if (active) setError(cause.message) })
    return () => { active = false }
  }, [])
  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(''); setMessage('')
    try {
      setSettings(await saveSpraySettings(settings))
      setMessage('Salvo. Os visitantes recebem a alteração ao abrir ou atualizar o site.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.') }
    finally { setSaving(false) }
  }
  return <form className="admin-announcement" onSubmit={save} style={{ marginBottom: 24 }}>
    <h2>Gotículas do spray</h2>
    <p>Controle o efeito de partículas no desktop e no celular.</p>
    {error && <p role="alert">{error}</p>}
    {!ready && !error && <p role="status">Carregando...</p>}
    <fieldset disabled={!ready || saving}>
      <label className="admin-announcement-toggle"><input type="checkbox" checked={settings.spray_enabled} onChange={(event) => { setSettings({ ...settings, spray_enabled: event.target.checked }); setMessage('') }} /> Ativar gotículas</label>
      <label>Quantidade por borrifada: {settings.particle_count}<input type="range" min="50" max="1500" step="50" value={settings.particle_count} onChange={(e) => { setSettings({ ...settings, particle_count: Number(e.target.value) }); setMessage('') }} /></label>
      <label>Cor das gotículas<input type="color" value={settings.particle_color} onChange={(e) => { setSettings({ ...settings, particle_color: e.target.value }); setMessage('') }} /></label>
      <label>Opacidade: {settings.particle_opacity}%<input type="range" min="0" max="100" value={settings.particle_opacity} onChange={(e) => { setSettings({ ...settings, particle_opacity: Number(e.target.value) }); setMessage('') }} /></label>
      <button className="admin-button" type="submit">{saving ? 'Salvando...' : 'Salvar gotículas'}</button>
    </fieldset>
    {message && <p role="status">{message}</p>}
  </form>
}
