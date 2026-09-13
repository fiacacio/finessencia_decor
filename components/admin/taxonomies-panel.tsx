'use client'
import { useRef, useState, type FormEvent } from 'react'
import { createTaxonomy, updateTaxonomy, deleteTaxonomy, type Taxonomy, type TaxonomyInput } from '@/services/taxonomies'
import { uploadProductImage } from '@/services/products'
import { adminErrorMessage } from '@/lib/admin-errors'
import type { TaxonomyKind } from '@/lib/taxonomy-images'
import type { Product } from '@/lib/products'

const blank: TaxonomyInput = { name:'', imageUrl:null, hoverImageUrl:null }
export function TaxonomiesPanel({kind,items,products,onSaved}: {kind:TaxonomyKind;items:Taxonomy[];products:Product[];onSaved:()=>Promise<void>}) {
  const [editing,setEditing] = useState<Taxonomy|null>(null)
  const [form,setForm] = useState<TaxonomyInput>(blank)
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  const [message,setMessage] = useState('')
  const [preview,setPreview] = useState(false)
  const [hovered,setHovered] = useState(false)
  const editorRef = useRef<HTMLFormElement>(null)
  const label = kind === 'categories' ? 'categoria' : 'essência'
  function reset() { setEditing(null);setForm(blank);setPreview(false);setError('') }
  async function save(event: FormEvent) {
    event.preventDefault();setBusy(true);setError('');setMessage('')
    try { if (editing) await updateTaxonomy(kind,editing,form); else await createTaxonomy(kind,form); reset();setMessage('Cadastro salvo. As fotos aparecem no site ao atualizar a página.');await onSaved() }
    catch (cause) { setError(adminErrorMessage(cause)) } finally { setBusy(false) }
  }
  async function upload(file:File|undefined,key:'imageUrl'|'hoverImageUrl') {
    if (!file) return
    setBusy(true);setError('');setMessage('')
    try { const url = await uploadProductImage(file);setForm(previous=>({...previous,[key]:url})) }
    catch (cause) { setError(adminErrorMessage(cause)) } finally { setBusy(false) }
  }
  async function remove(item:Taxonomy) {
    if (!window.confirm('Excluir “'+item.name+'”?')) return
    setBusy(true);setError('');setMessage('')
    try { await deleteTaxonomy(kind,item);if(editing?.id===item.id)reset();await onSaved();setMessage('Cadastro excluído.') }
    catch(cause) { setError(adminErrorMessage(cause)) } finally { setBusy(false) }
  }
  return <div className="admin-taxonomy-editor">
    <form ref={editorRef} onSubmit={save} className="admin-taxonomy-edit-form">
      <h2>{editing?'Editar':'Nova'} {label}</h2>
      <p>Escolha a capa e a segunda foto, exibida ao passar o mouse.</p>
      {error && <p role="alert" className="admin-inline-error">{error}</p>}
      {message && <p role="status">{message}</p>}
      <fieldset disabled={busy}>
        <label>Nome<input className="admin-input" required value={form.name} onChange={e=>{setForm({...form,name:e.target.value});setMessage('')}} /></label>
        <div className="admin-taxonomy-photos">{(['imageUrl','hoverImageUrl'] as const).map(key=><div key={key}>
          <label className="admin-taxonomy-photo"><strong>{key==='imageUrl'?'Foto de capa':'Foto ao passar o mouse'}</strong>
            <span className="admin-taxonomy-photo-preview">{form[key]?<img src={form[key]!} alt={key==='imageUrl'?'Capa atual':'Segunda foto atual'}/>:<span>Sem foto</span>}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{void upload(e.target.files?.[0],key);e.target.value=''}} />
          </label><small>JPG, PNG ou WEBP · até 5 MB</small>
          {form[key]&&<button className="admin-text-button" type="button" onClick={()=>{setForm({...form,[key]:null});setMessage('')}}>Remover foto</button>}
        </div>)}</div>
        <div className="admin-taxonomy-live-preview">
          {form.imageUrl ? <img onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} src={((preview || hovered) && form.hoverImageUrl) || form.imageUrl} alt="Prévia da troca de fotos"/> : <span>Escolha uma capa para ver a prévia</span>}
          <button type="button" className="admin-secondary" aria-pressed={preview} onClick={()=>setPreview(!preview)}>Alternar prévia</button>
        </div>
        <div className="admin-form-actions"><button className="admin-secondary" type="button" onClick={reset}>Cancelar</button><button className="admin-button">{busy?'Aguarde...':'Salvar '+label}</button></div>
      </fieldset>
    </form>
    <section className="admin-taxonomy-list" aria-label={kind==='categories'?'Categorias cadastradas':'Essências cadastradas'}>{items.length===0?<p>Nenhum cadastro encontrado.</p>:items.map(item=><article key={item.id}>
      <div className="admin-taxonomy-summary"><div className="admin-taxonomy-thumbs">{[item.imageUrl,item.hoverImageUrl].map((url,index)=>url?<img key={index} src={url} alt={index===0?'Capa':'Segunda foto'}/>:<span key={index}>Sem foto</span>)}</div><div><h2>{item.name}</h2><p>{products.filter(product=>kind==='categories'?product.categoryId===item.id:product.essenceIds?.includes(item.id)||product.allEssences).length} produto(s) associado(s)</p></div></div>
      <div className="admin-taxonomy-buttons"><button type="button" className="admin-secondary" disabled={busy} onClick={()=>{setEditing(item);setForm({name:item.name,imageUrl:item.imageUrl,hoverImageUrl:item.hoverImageUrl});setError('');setMessage('');setPreview(false);editorRef.current?.scrollIntoView({block:'start'})}}>Editar {item.name}</button><button type="button" className="admin-text-button" disabled={busy} onClick={()=>void remove(item)}>Excluir</button></div>
    </article>)}</section>
  </div>
}
