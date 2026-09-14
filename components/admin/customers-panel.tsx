'use client'

import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react'
import { defaultCustomerPopup, type Customer } from '@/lib/customer-popup'
import { getCustomerPopup, getCustomers, saveCustomerPopup } from '@/services/customers'
import { createSupabaseClient } from '@/lib/supabase'
import { CustomerPopup } from '@/components/customer-popup'

export function CustomersPanel() {
  const [settings, setSettings] = useState(defaultCustomerPopup)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState(false)
  useEffect(() => {
    let active = true
    Promise.all([getCustomerPopup(), getCustomers()]).then(([config, rows]) => { if (active) { setSettings(config); setCustomers(rows); setReady(true) } }).catch((cause) => { if (active) setError(cause.message) })
    return () => { active = false }
  }, [])
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setError(''); setMessage('')
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5242880) { setError('Selecione JPG, PNG ou WEBP de até 5 MB.'); return }
    setBusy(true)
    try {
      const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[file.type]
      const path = `${crypto.randomUUID()}.${extension}`
      const storage = createSupabaseClient().storage.from('popup-images')
      const { error: uploadError } = await storage.upload(path, file, { contentType: file.type })
      if (uploadError) throw new Error('Não foi possível enviar a imagem.')
      setSettings((current) => ({ ...current, image_url: storage.getPublicUrl(path).data.publicUrl }))
      setMessage('Imagem enviada. Salve as alterações para publicar.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Falha no envio.') }
    finally { setBusy(false) }
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('')
    try { await saveCustomerPopup(settings); setMessage('Pop-up salvo. A configuração será usada nas próximas visitas.') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.') }
    finally { setBusy(false) }
  }
  return <>
    <form className="admin-announcement" onSubmit={save}>
      <h2>Pop-up de cadastro</h2>
      {error && <p role="alert">{error}</p>}
      {!ready && !error && <p role="status">Carregando...</p>}
      <fieldset disabled={!ready || busy}>
        <label className="admin-announcement-toggle"><input type="checkbox" checked={settings.enabled} onChange={(e) => { setMessage(''); setSettings({ ...settings, enabled: e.target.checked }) }} /> Exibir pop-up ao abrir o site</label>
        <label>Título<input className="admin-input" required maxLength={120} value={settings.title} onChange={(e) => { setMessage(''); setSettings({ ...settings, title: e.target.value }) }} /></label>
        <label>Código de cupom (opcional)<input className="admin-input" maxLength={60} value={settings.coupon_code} onChange={(e) => { setMessage(''); setSettings({ ...settings, coupon_code: e.target.value }) }} /></label>
        <p>O código será mostrado após o cadastro para uso no pedido pelo WhatsApp. Cadastre apenas um cupom que a loja vá aceitar; não há cálculo automático de desconto.</p>
        <label>Imagem do pop-up<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} />JPG, PNG ou WEBP · até 5 MB</label>
        <img className="admin-popup-thumbnail" src={settings.image_url} alt="Imagem selecionada para o pop-up" />
        <button className="admin-secondary" type="button" onClick={() => setPreview(true)}>Visualizar pop-up</button>
        <button className="admin-button">{busy ? 'Aguarde...' : 'Salvar alterações'}</button>
      </fieldset>
      {message && <p role="status">{message}</p>}
    </form>
    <section className="admin-customers"><h2>Clientes cadastrados</h2><p>Até 100 cadastros mais recentes. A autorização para novidades é opcional.</p>
      {ready && !customers.length && <p>Nenhum cadastro por enquanto.</p>}
      {!!customers.length && <div className="admin-customers-scroll"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Celular</th><th>Nascimento</th><th>Novidades</th><th>Cadastro</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id}><td>{customer.name}</td><td>{customer.email}</td><td>{customer.phone}</td><td>{customer.birth_date ? customer.birth_date.split('-').reverse().join('/') : '—'}</td><td>{customer.marketing_consent ? 'Autorizado' : 'Não autorizado'}</td><td>{new Date(customer.created_at).toLocaleDateString('pt-BR')}</td></tr>)}</tbody></table></div>}
    </section>
    {preview && <CustomerPopup settings={settings} preview onClose={() => setPreview(false)} />}
  </>
}

