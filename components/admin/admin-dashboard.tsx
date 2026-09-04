'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { Check, ImagePlus, LoaderCircle, LogOut, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { createSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'
import { formatPrice, type Product, type ProductInput } from '@/lib/products'
import { createProduct, deleteProduct, getProducts, removeProductImage, updateProduct, uploadProductImage } from '@/services/products'

const emptyProduct: ProductInput = { name: '', description: '', price: 0, category: '', essence: '', detail: '', active: true, imageUrl: null }

const inputClass = 'admin-input'
const isAdmin = (appMetadata: Record<string, unknown> | undefined) =>
  appMetadata?.role === 'admin'

export function AdminDashboard() {
  const [ready, setReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductInput>(emptyProduct)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [category, setCategory] = useState('all')
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
  const [login, setLogin] = useState({ email: '', password: '' })

  const notify = (message: string, error = false) => {
    setToast({ message, error })
    window.setTimeout(() => setToast(null), 4200)
  }

  const loadProducts = async () => {
    setLoading(true)
    try { setProducts(await getProducts()) } catch (error) { notify(error instanceof Error ? error.message : 'Não foi possível carregar os produtos.', true) } finally { setLoading(false) }
  }

  useEffect(() => {
    if (!isSupabaseConfigured) { setReady(true); return }
    const supabase = createSupabaseClient()
    supabase.auth.getUser().then(({ data }) => {
      const allowed = Boolean(data.user && isAdmin(data.user.app_metadata))
      setAuthenticated(allowed)
      setReady(true)
      if (allowed) void loadProducts()
    })
  }, [])

  const categories = useMemo(() => [...new Set(products.map((product) => product.category).filter(Boolean) as string[])].sort(), [products])
  const filtered = useMemo(() => products.filter((product) => {
    const haystack = `${product.name} ${product.category ?? ''} ${product.essence ?? ''}`.toLocaleLowerCase('pt-BR')
    return haystack.includes(query.toLocaleLowerCase('pt-BR')) && (status === 'all' || (status === 'active') === product.active) && (category === 'all' || product.category === category)
  }), [products, query, status, category])

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setFormOpen(true) }
  const openEdit = (product: Product) => { setEditing(product); setForm({ name: product.name, description: product.description ?? '', price: product.price, category: product.category ?? '', essence: product.essence ?? '', detail: product.detail ?? '', active: product.active, imageUrl: product.imageUrl }); setFormOpen(true) }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      const { data, error } = await createSupabaseClient().auth.signInWithPassword(login)
      if (error) throw error
      if (!isAdmin(data.user?.app_metadata)) { await createSupabaseClient().auth.signOut(); throw new Error('Esta conta não tem acesso administrativo.') }
      setAuthenticated(true); await loadProducts()
    } catch (error) { notify(error instanceof Error ? error.message : 'Não foi possível entrar.', true) } finally { setSaving(false) }
  }

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return notify('Selecione uma imagem JPG, PNG ou WEBP.', true)
    if (file.size > 5 * 1024 * 1024) return notify('A imagem deve ter no máximo 5 MB.', true)
    setSaving(true)
    try {
      const imageUrl = await uploadProductImage(file)
      setForm((current) => ({ ...current, imageUrl }))
      notify('Imagem enviada com sucesso.')
    } catch (error) { notify(error instanceof Error ? error.message : 'Falha no upload da imagem.', true) } finally { setSaving(false) }
  }

  const handleSave = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.name.trim() || Number.isNaN(form.price) || form.price < 0) return notify('Informe nome e preço válidos.', true)
    setSaving(true)
    try {
      const saved = editing ? await updateProduct(editing.id, form) : await createProduct(form)
      if (editing?.imageUrl && editing.imageUrl !== saved.imageUrl) await removeProductImage(editing.imageUrl)
      setProducts((current) => editing ? current.map((product) => product.id === saved.id ? saved : product) : [saved, ...current])
      setFormOpen(false); notify(editing ? 'Produto atualizado com sucesso.' : 'Produto criado com sucesso.')
    } catch (error) { notify(error instanceof Error ? error.message : 'Erro ao salvar o produto.', true) } finally { setSaving(false) }
  }

  const toggleStatus = async (product: Product) => {
    try {
      const saved = await updateProduct(product.id, { name: product.name, description: product.description ?? '', price: product.price, category: product.category ?? '', essence: product.essence ?? '', detail: product.detail ?? '', imageUrl: product.imageUrl, active: !product.active })
      setProducts((current) => current.map((item) => item.id === saved.id ? saved : item)); notify(saved.active ? 'Produto ativado.' : 'Produto desativado.')
    } catch (error) { notify(error instanceof Error ? error.message : 'Não foi possível alterar o status.', true) }
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setSaving(true)
    try {
      await deleteProduct(pendingDelete.id); await removeProductImage(pendingDelete.imageUrl)
      setProducts((current) => current.filter((product) => product.id !== pendingDelete.id)); setPendingDelete(null); notify('Produto excluído.')
    } catch (error) { notify(error instanceof Error ? error.message : 'Não foi possível excluir o produto.', true) } finally { setSaving(false) }
  }

  if (!ready) return <main className="admin-shell admin-center"><LoaderCircle className="admin-spinner" /><span>Preparando seu painel...</span></main>
  if (!isSupabaseConfigured) return <main className="admin-shell admin-center"><img src="/Logo PNG Caramelo.png" alt="Finessência" className="admin-logo" /><h1>Conecte o Supabase</h1><p>Adicione as variáveis do arquivo <code>.env.example</code> para ativar o painel administrativo.</p></main>
  if (!authenticated) return <main className="admin-shell admin-center"><section className="admin-login"><img src="/Logo PNG Caramelo.png" alt="Finessência" className="admin-logo" /><p className="admin-eyebrow">ÁREA RESTRITA</p><h1>Boas-vindas de volta.</h1><p>Entre para cuidar do catálogo da Finessência.</p><form onSubmit={handleLogin}><label>E-mail<input className={inputClass} type="email" required value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} /></label><label>Senha<input className={inputClass} type="password" required value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></label><button className="admin-button" disabled={saving}>{saving ? 'Entrando...' : 'Entrar'}</button></form></section>{toast && <Toast {...toast} />}</main>

  return <main className="admin-shell"><header className="admin-header"><a href="/" aria-label="Ver site da Finessência"><img src="/Logo PNG Caramelo.png" alt="Finessência" className="admin-logo" /></a><div><span>PAINEL ADMINISTRATIVO</span><button className="admin-text-button" onClick={async () => { await createSupabaseClient().auth.signOut(); setAuthenticated(false) }}><LogOut size={15} /> Sair</button></div></header><section className="admin-content"><div className="admin-title-row"><div><p className="admin-eyebrow">CATÁLOGO</p><h1>Produtos</h1><p>Organize as criações que aparecem na sua vitrine.</p></div><button className="admin-button" onClick={openCreate}><Plus size={17} /> Adicionar produto</button></div><div className="admin-stats"><Stat label="Total de produtos" value={products.length} /><Stat label="Produtos ativos" value={products.filter((item) => item.active).length} /><Stat label="Produtos inativos" value={products.filter((item) => !item.active).length} /><Stat label="Categorias" value={categories.length} /></div><div className="admin-toolbar"><label className="admin-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto..." /></label><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">Todos os status</option><option value="active">Ativos</option><option value="inactive">Inativos</option></select><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">Todas as categorias</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>{loading ? <div className="admin-loading"><LoaderCircle className="admin-spinner" /> Carregando produtos...</div> : filtered.length === 0 ? <section className="admin-empty"><ImagePlus size={35} /><h2>{products.length ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado'}</h2><p>{products.length ? 'Tente ajustar a busca ou os filtros.' : 'Comece adicionando o primeiro produto ao catálogo da Finessência.'}</p>{products.length === 0 && <button className="admin-button" onClick={openCreate}><Plus size={17} /> Adicionar produto</button>}</section> : <section className="admin-list">{filtered.map((product) => <article className="admin-product" key={product.id}><div className="admin-product-image">{product.imageUrl ? <img src={product.imageUrl} alt="" /> : <ImagePlus size={22} />}</div><div className="admin-product-main"><h2>{product.name}</h2><p>{product.category || 'Sem categoria'}{product.essence && ` · ${product.essence}`}</p><strong>{formatPrice(product.price)}</strong></div><span className={`admin-status ${product.active ? 'is-active' : ''}`}>{product.active ? 'Ativo' : 'Inativo'}</span><time>Atualizado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(product.updatedAt))}</time><div className="admin-actions"><button aria-label={`Editar ${product.name}`} onClick={() => openEdit(product)}><Pencil size={16} /></button><button aria-label={product.active ? `Desativar ${product.name}` : `Ativar ${product.name}`} onClick={() => toggleStatus(product)}><Check size={16} /></button><button aria-label={`Excluir ${product.name}`} className="is-danger" onClick={() => setPendingDelete(product)}><Trash2 size={16} /></button></div></article>)}</section>}</section>{formOpen && <ProductForm form={form} setForm={setForm} editing={editing} saving={saving} onClose={() => setFormOpen(false)} onSave={handleSave} onImage={handleImage} />}{pendingDelete && <div className="admin-modal-layer"><section className="admin-confirm"><button className="admin-close" onClick={() => setPendingDelete(null)}><X size={19} /></button><p className="admin-eyebrow">CONFIRMAÇÃO</p><h2>Excluir produto?</h2><p>Você tem certeza que deseja excluir <strong>“{pendingDelete.name}”</strong>? Essa ação não poderá ser desfeita.</p><div><button className="admin-secondary" onClick={() => setPendingDelete(null)}>Cancelar</button><button className="admin-button is-danger" disabled={saving} onClick={confirmDelete}>{saving ? 'Excluindo...' : 'Excluir'}</button></div></section></div>}{toast && <Toast {...toast} />}</main>
}

function Stat({ label, value }: { label: string; value: number }) { return <article><strong>{value}</strong><span>{label}</span></article> }
function Toast({ message, error }: { message: string; error?: boolean }) { return <div className={`admin-toast${error ? ' is-error' : ''}`}>{message}</div> }
function ProductForm({ form, setForm, editing, saving, onClose, onSave, onImage }: { form: ProductInput; setForm: React.Dispatch<React.SetStateAction<ProductInput>>; editing: Product | null; saving: boolean; onClose: () => void; onSave: (event: FormEvent) => void; onImage: (event: ChangeEvent<HTMLInputElement>) => void }) {
  const set = (key: keyof ProductInput, value: string | number | boolean | null) => setForm((current) => ({ ...current, [key]: value }))
  return <div className="admin-modal-layer"><section className="admin-modal"><button className="admin-close" onClick={onClose}><X size={19} /></button><p className="admin-eyebrow">{editing ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}</p><h2>{editing ? editing.name : 'Adicionar produto'}</h2><form onSubmit={onSave}><div className="admin-form-grid"><label>Nome*<input className={inputClass} required value={form.name} onChange={(event) => set('name', event.target.value)} /></label><label>Preço (R$)*<input className={inputClass} type="number" required min="0" step="0.01" value={form.price || ''} onChange={(event) => set('price', Number(event.target.value))} /></label><label>Categoria<input className={inputClass} value={form.category} onChange={(event) => set('category', event.target.value)} placeholder="Ex.: Velas" /></label><label>Essência / fragrância<input className={inputClass} value={form.essence} onChange={(event) => set('essence', event.target.value)} placeholder="Ex.: Lavanda" /></label><label>Detalhe<input className={inputClass} value={form.detail} onChange={(event) => set('detail', event.target.value)} placeholder="Ex.: 120 g" /></label><label className="admin-switch-label">Visível no catálogo<input type="checkbox" checked={form.active} onChange={(event) => set('active', event.target.checked)} /><span className="admin-switch" /></label><label className="admin-description">Descrição<textarea className={inputClass} rows={4} value={form.description} onChange={(event) => set('description', event.target.value)} /></label></div><label className="admin-upload">{form.imageUrl ? <img src={form.imageUrl} alt="Prévia do produto" /> : <><ImagePlus size={30} /><strong>Arraste a imagem ou selecione um arquivo</strong><span>JPG, PNG ou WEBP · até 5 MB</span></>}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={onImage} disabled={saving} /></label><div className="admin-form-actions"><button type="button" className="admin-secondary" onClick={onClose}>Cancelar</button><button className="admin-button" disabled={saving}>{saving ? 'Salvando...' : 'Salvar produto'}</button></div></form></section></div>
}
