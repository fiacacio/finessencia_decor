'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { CustomerPopupSettings } from '@/lib/customer-popup'
import { registerCustomer } from '@/services/customers'

export function CustomerPopup({ settings, preview = false, onClose }: { settings: CustomerPopupSettings; preview?: boolean; onClose?: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const restore = useRef(() => {})
  const closing = useRef(false)
  useEffect(() => {
    if (!settings.enabled && !preview) return
    if (!preview) { try { if (localStorage.getItem('finessencia-customer-registered') || sessionStorage.getItem('finessencia-popup-dismissed')) return } catch {} }
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    let opened = false
    restore.current = () => {
      if (!opened) return
      opened = false
      document.body.style.overflow = previousOverflow
      document.documentElement.classList.remove('customer-modal-open')
      document.dispatchEvent(new Event('customer-modal-change'))
      previousFocus?.focus()
    }
    const timer = window.setTimeout(() => {
      if (!dialog.current) return
      dialog.current.showModal(); opened = true
      document.body.style.overflow = 'hidden'
      document.documentElement.classList.add('customer-modal-open')
      document.dispatchEvent(new Event('customer-modal-change'))
    }, preview ? 0 : 1800)
    return () => { clearTimeout(timer); if (closeTimer.current) clearTimeout(closeTimer.current); restore.current() }
  }, [settings.enabled, preview])
  function close() {
    if (closing.current) return
    closing.current = true
    dialog.current?.classList.add('is-closing')
    if (!preview) { try { sessionStorage.setItem('finessencia-popup-dismissed', '1') } catch {} }
    closeTimer.current = setTimeout(() => {
      dialog.current?.close(); restore.current(); onClose?.()
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260)
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (preview) { setDone(true); return }
    const data = new FormData(event.currentTarget)
    if (data.get('website')) return
    setSaving(true); setError('')
    try {
      await registerCustomer({ name: String(data.get('name')), email: String(data.get('email')), phone: String(data.get('phone')), birth_date: String(data.get('birth_date') || ''), marketing_consent: data.get('marketing_consent') === 'on' })
      setDone(true)
      try { localStorage.setItem('finessencia-customer-registered', '1') } catch {}
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível cadastrar.') }
    finally { setSaving(false) }
  }
  return <dialog ref={dialog} className="customer-popup" aria-labelledby="customer-popup-title" onCancel={(event) => { event.preventDefault(); close() }} onClick={(event) => { if (event.target === dialog.current) { const box = dialog.current.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close() } }}>
    <div className="customer-popup-layout">
      <button className="customer-popup-close" type="button" onClick={close} aria-label="Fechar cadastro">×</button>
      <div className="customer-popup-copy">
        <p className="eyebrow">FINESSÊNCIA</p>
        <h2 id="customer-popup-title">{done ? 'Obrigada por se cadastrar!' : settings.title}</h2>
        {done ? <div role="status"><p>Seu cadastro foi recebido.</p>{settings.coupon_code && <p>Seu cupom: <strong className="customer-coupon">{settings.coupon_code}</strong><small>Informe este código ao fazer seu pedido pelo WhatsApp.</small></p>}<button className="admin-button" onClick={close}>Continuar no site</button></div> : <form onSubmit={submit}>
          <label>Nome<input name="name" autoComplete="name" required minLength={2} maxLength={120} /></label>
          <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
          <label>Celular<input name="phone" type="tel" autoComplete="tel" required minLength={10} maxLength={25} pattern="[0-9+() .-]{10,25}" /></label>
          <label>Data de nascimento <span>(opcional)</span><input name="birth_date" type="date" autoComplete="bday" max={new Date().toLocaleDateString('en-CA')} /></label>
          <label className="customer-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <label className="customer-consent"><input name="marketing_consent" type="checkbox" /> Quero receber novidades e ofertas da Finessência por e-mail e celular.</label>
          <p className="customer-data-note">Usaremos seus dados para manter seu cadastro. Novidades e ofertas serão enviadas apenas se você autorizar. Para solicitar alteração ou exclusão, fale conosco pelo <a href="https://wa.me/5519993962062" target="_blank" rel="noreferrer">WhatsApp</a>.</p>
          {error && <p role="alert">{error}</p>}
          <button className="admin-button" disabled={saving}>{saving ? 'Cadastrando...' : settings.coupon_code ? 'Receber cupom' : 'Quero me cadastrar'}</button>
        </form>}
      </div>
      <div className="customer-popup-image"><img src={settings.image_url} alt="Criações aromáticas da Finessência" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/essencias_clique/Difusores.webp' }} /></div>
    </div>
  </dialog>
}
