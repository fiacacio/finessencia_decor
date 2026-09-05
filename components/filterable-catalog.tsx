'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { FaWhatsapp } from 'react-icons/fa6'
import { ProductImage } from '@/components/product-image'
import { essenceLabel, formatPrice, type CatalogProduct } from '@/lib/products'

const whatsappUrl = 'https://wa.me/5519993962062'
const getWhatsAppUrl = (name: string) => whatsappUrl + '?text=' + encodeURIComponent('Olá! Tenho interesse no produto ' + name + '.')
const webpSource = (source: string) => source.replace(/\.(png|jpe?g|jfif)$/i, '.webp')
const categoryKey = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR')

export function FilterableCatalog({ catalogProducts, productShowcase }: { catalogProducts: CatalogProduct[]; productShowcase: { name: string; image: string }[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const catalog = useRef<HTMLElement>(null)
  const filtered = selected ? catalogProducts.filter(product => categoryKey(product.category) === categoryKey(selected)) : catalogProducts
  const selectCategory = (name: string) => {
    setSelected(name)
    requestAnimationFrame(() => catalog.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }))
  }
  return <>    <section className="showcase" aria-labelledby="showcase-title"><p className="eyebrow">CATEGORIAS</p><h2 id="showcase-title">ENCONTRE O SEU RITUAL</h2><div className="showcase-grid"><div className="showcase-track">{[false, true].map((isDuplicate) => <div className="showcase-set" aria-hidden={isDuplicate} key={String(isDuplicate)}>{productShowcase.map((product) => <button type="button" className="showcase-card category-choice" tabIndex={isDuplicate ? -1 : 0} aria-pressed={selected === product.name} onClick={() => selectCategory(product.name)} key={`${product.name}-${isDuplicate}`}><div className="showcase-media"><Image src={webpSource(product.image)} alt={isDuplicate ? '' : `Categoria ${product.name}`} fill sizes="(max-width: 700px) 85vw, 300px" /></div><h3>{product.name}</h3></button>)}</div>)}</div></div></section>
    <section id="mostruario" ref={catalog} className="catalog" aria-labelledby="catalog-title"><p className="eyebrow">MOSTRUÁRIO</p><h2 id="catalog-title">ESCOLHA SEU PRODUTO</h2><div className="catalog-filter" aria-live="polite">{selected && <><span>{selected} · {filtered.length} produto(s)</span><button type="button" onClick={() => setSelected(null)}>Mostrar todos</button></>}</div>{selected && !filtered.length && <p className="catalog-empty">Nenhum produto disponível nesta categoria no momento.</p>}<div className="catalog-grid">{filtered.map((product) => <article className="catalog-card" key={product.id}>{product.imageUrl ? <ProductImage src={product.imageUrl.startsWith('/') ? webpSource(product.imageUrl) : product.imageUrl} name={product.name}>{product.imageUrl.startsWith('/') ? <Image src={webpSource(product.imageUrl)} alt={product.name} fill sizes="(max-width: 700px) 50vw, 300px" /> : <img src={product.imageUrl} alt={product.name} loading="lazy" />}</ProductImage> : <div className="catalog-media" />}<div className="catalog-info"><h3>{product.name}</h3><p className="catalog-meta">{product.detail && <span>{product.detail}</span>}<span className="catalog-description">{product.category}</span></p><p className="catalog-description">{essenceLabel(product)}</p><p className="catalog-description">{product.description}</p><div className="catalog-price"><strong>{formatPrice(product.price)}</strong><a href={getWhatsAppUrl(product.name)} target="_blank" rel="noreferrer" aria-label={`Pedir ${product.name} pelo WhatsApp`}><FaWhatsapp /></a></div></div></article>)}<a className="catalog-contact-card" href={whatsappUrl} target="_blank" rel="noreferrer"><FaWhatsapp /><span>Presentes? Casamentos? Pedidos personalizados?</span><strong>FALE CONOSCO</strong></a></div></section>
</>
}
