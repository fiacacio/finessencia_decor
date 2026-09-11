'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { defaultAnnouncement, saoPauloDate } from '@/lib/announcement'
import { getAnnouncement, saveAnnouncement } from '@/services/announcement'
import { AnnouncementBar } from '@/components/announcement-bar'

export function AnnouncementPanel() {
  const [settings, setSettings] = useState(defaultAnnouncement)
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    getAnnouncement().then((value) => { if (active) { setSettings(value); setReady(true) } }).catch((cause) => { if (active) setError(cause.message) })
    return () => { active = false }
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true); setError(''); setMessage('')
    try {
      setSettings(await saveAnnouncement(settings))
      setMessage('Barra salva. A alteração aparece para todos os visitantes ao abrir ou atualizar o site.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.') }
    finally { setSaving(false) }
  }

  return <form className="admin-announcement" onSubmit={submit}>
    {error && <p role="alert">{error}</p>}
    {!ready && !error && <p role="status">Carregando barra superior...</p>}
    <fieldset disabled={!ready || saving}>
      <label className="admin-announcement-toggle"><input type="checkbox" checked={settings.visible} onChange={(e) => { setMessage(''); setSettings({ ...settings, visible: e.target.checked }) }} /> Mostrar barra superior</label>
      <label>Texto da barra<input className="admin-input" required maxLength={160} value={settings.text} onChange={(e) => { setMessage(''); setSettings({ ...settings, text: e.target.value }) }} /></label>
      <label>Cor de fundo<input type="color" value={settings.color} onChange={(e) => { setMessage(''); setSettings({ ...settings, color: e.target.value }) }} /></label>
      <label className="admin-announcement-toggle"><input type="checkbox" checked={settings.marquee} onChange={(e) => { setMessage(''); setSettings({ ...settings, marquee: e.target.checked }) }} /> Ativar letreiro em movimento</label>
      <label className="admin-announcement-toggle"><input type="checkbox" checked={settings.show_fairs} onChange={(e) => { setMessage(''); setSettings({ ...settings, show_fairs: e.target.checked }) }} /> Exibir próximas feiras no lugar do texto da barra</label>
      <div className="admin-fairs">
        <p>Próximas feiras</p>
        <p>A feira aparece até o fim da data final, no horário de São Paulo. Quando todas passarem, a barra de feiras fica oculta.</p>
        {settings.fairs.map((fair, index) => <div className="admin-fair" key={fair.id}>
          <label>Descrição da feira<input className="admin-input" required maxLength={240} value={fair.label} onChange={(e) => { setMessage(''); setSettings({ ...settings, fairs: settings.fairs.map((item, i) => i === index ? { ...item, label: e.target.value } : item) }) }} /></label>
          <label>Último dia<input className="admin-input" type="date" required value={fair.endDate} onChange={(e) => { setMessage(''); setSettings({ ...settings, fairs: settings.fairs.map((item, i) => i === index ? { ...item, endDate: e.target.value } : item) }) }} /></label>
          {fair.endDate && fair.endDate < saoPauloDate() && <span>Encerrada — não aparece no site.</span>}
          <button className="admin-secondary" type="button" onClick={() => { setMessage(''); setSettings({ ...settings, fairs: settings.fairs.filter((_, i) => i !== index) }) }}>Remover feira</button>
        </div>)}
        <button className="admin-secondary" type="button" disabled={settings.fairs.length >= 30} onClick={() => { setMessage(''); setSettings({ ...settings, fairs: [...settings.fairs, { id: crypto.randomUUID(), label: '', endDate: '' }] }) }}>Adicionar feira</button>
      </div>
      <div className="admin-announcement-preview"><p>Prévia</p>{settings.visible ? <AnnouncementBar settings={settings} /> : <p>A barra ficará oculta no site.</p>}</div>
      <button className="admin-button" type="submit">{saving ? 'Salvando...' : 'Salvar alterações'}</button>
    </fieldset>
    {message && <p role="status">{message}</p>}
  </form>
}
