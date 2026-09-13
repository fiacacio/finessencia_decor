import { taxonomyDefaults } from '@/lib/taxonomy-images'
import { getTaxonomies } from '@/services/taxonomies'
import { sectionColorProps, type SectionColors } from '@/lib/section-colors'
import { getSectionColors } from '@/services/section-colors'
import { defaultSpraySettings } from '@/lib/spray-settings'
import { getSpraySettings } from '@/services/spray-settings'
import { AnnouncementBar } from '@/components/announcement-bar'
import { defaultAnnouncement } from '@/lib/announcement'
import { getAnnouncement } from '@/services/announcement'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6'
import Image from 'next/image'
import { EffectsController } from '@/components/effects-controller'
import { LoadingScreen } from '@/components/loading-screen'
import { fallbackCatalogProducts, formatPrice } from '@/lib/products'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getProducts } from '@/services/products'

const instagramUrl = 'https://www.instagram.com/finessenciadecor/'
const whatsappUrl = 'https://wa.me/5519993962062'


const getWhatsAppUrl = (productName: string) => `https://wa.me/5519993962062?text=${encodeURIComponent(`Olá! Tenho interesse no produto ${productName}.`)}`
const webpSource = (source: string) => source.startsWith('/') ? source.replace(/\.(png|jpe?g|jfif)$/i, '.webp') : source

export const dynamic = 'force-dynamic'

export default async function Page() {
  let products = taxonomyDefaults.essences
  let productShowcase = taxonomyDefaults.categories
  if (isSupabaseConfigured) {
    const results = await Promise.allSettled([getTaxonomies('essences'),getTaxonomies('categories')])
    const toShowcase = (items: Awaited<ReturnType<typeof getTaxonomies>>) => items.map(item => ({name:item.name,image:item.imageUrl,hoverImage:item.hoverImageUrl}))
    if (results[0].status === 'fulfilled') products = toShowcase(results[0].value)
    if (results[1].status === 'fulfilled') productShowcase = toShowcase(results[1].value)
  }
  let sectionColors: SectionColors = {}
  if (isSupabaseConfigured) {
    try { sectionColors = await getSectionColors() } catch { /* Keep the original design when settings are unavailable. */ }
  }
  let spraySettings = defaultSpraySettings
  if (isSupabaseConfigured) {
    try { spraySettings = await getSpraySettings() } catch { /* Preserve the existing effect until settings are available. */ }
  }
  let announcement = defaultAnnouncement
  if (isSupabaseConfigured) {
    try { announcement = await getAnnouncement() } catch { /* Keep the default announcement until settings are available. */ }
  }
  let catalogProducts = fallbackCatalogProducts
  if (isSupabaseConfigured) {
    try {
      catalogProducts = await getProducts(true)
    } catch {
      // Keeps the public experience available until Supabase is configured or reachable.
    }
  }
  return <main className="site-shell">
    <LoadingScreen />
    <EffectsController spraySettings={spraySettings} />
    <AnnouncementBar settings={sectionColors.announcement ? { ...announcement, color: sectionColors.announcement } : announcement} />
    <header className="site-header" {...sectionColorProps(sectionColors, 'header')}><div className="top-row">
      <a className="brand" href="#inicio" aria-label="Finessência — início"><img src="/Logo PNG Caramelo.png" alt="Finessência decor aromático" /></a>
      <div className="header-actions"><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a></div>
    </div></header>
    <section className="hero" {...sectionColorProps(sectionColors, 'hero')} id="inicio"><div className="hero-background" aria-hidden="true" /><span className="hero-botanical hero-botanical--large" aria-hidden="true" /><span className="hero-botanical hero-botanical--small" aria-hidden="true" /><div className="hero-image"><video autoPlay loop muted playsInline preload="metadata" poster="/abertura-poster.webp" aria-label="Vídeo de abertura da Finessência"><source src="/abertura.webm" type="video/webm" /><source src="/abertura.mp4" type="video/mp4" /></video><div className="hero-video-ending" aria-hidden="true"><img src="/Logo PNG Branco.png" alt="" /></div></div><div className="hero-copy"><p className="eyebrow">DECOR AROMÁTICO</p><h1>ACENDA<br />O MOMENTO</h1><span className="rule" /><p>ESSÊNCIAS QUE TRANSFORMAM<br />AMBIENTES EM MEMÓRIAS.</p><a className="button primary" href="#colecao"><span>CONHEÇA A COLEÇÃO</span></a></div></section>
    <section className="welcome" {...sectionColorProps(sectionColors, 'welcome')}><h2>BEM-VINDA À FINESSÊNCIA</h2><p>Uma pausa para sentir, acolher e transformar. Criamos aromas e detalhes que fazem de cada ambiente um lugar ainda mais seu.</p></section>
    <section className="arrivals" {...sectionColorProps(sectionColors, 'arrivals')} id="colecao"><p className="eyebrow">NOSSAS ESSÊNCIAS</p><h2>ESCOLHAS PARA SENTIR</h2><div className="product-grid"><div className="product-track">{[false, true].map((isDuplicate) => <div className="product-set" aria-hidden={isDuplicate} key={String(isDuplicate)}>{products.map((product) => <article className={`product${product.hoverImage ? ' has-hover-image' : ''}${product.name === 'Flor de Figo' ? ' product--fig' : ''}`} key={`${product.name}-${isDuplicate}`}><div className="product-media"><Image className="product-primary-image" src={product.image || '/Logo PNG Caramelo.png'} alt={isDuplicate ? '' : `Essência ${product.name}`} fill sizes="(max-width: 700px) 50vw, 300px" />{product.hoverImage && <Image className="product-hover-image" src={product.hoverImage} alt="" fill sizes="(max-width: 700px) 50vw, 300px" />}</div><h3>{product.name}</h3></article>)}</div>)}</div></div></section>
    <section className="showcase" {...sectionColorProps(sectionColors, 'showcase')} aria-labelledby="showcase-title"><p className="eyebrow">CATEGORIAS</p><h2 id="showcase-title">ENCONTRE O SEU RITUAL</h2><div className="showcase-grid"><div className="showcase-track">{[false, true].map((isDuplicate) => <div className="showcase-set" aria-hidden={isDuplicate} key={String(isDuplicate)}>{productShowcase.map((product) => <article className={`showcase-card${product.hoverImage ? ' has-hover-image' : ''}`} key={`${product.name}-${isDuplicate}`}><div className="showcase-media"><Image className="showcase-primary-image" src={product.image || '/Logo PNG Caramelo.png'} alt={isDuplicate ? '' : `Categoria ${product.name}`} fill sizes="(max-width: 700px) 85vw, 300px" />{product.hoverImage && <Image className="showcase-hover-image" src={product.hoverImage} alt="" fill sizes="(max-width: 700px) 85vw, 300px" />}</div><h3>{product.name}</h3></article>)}</div>)}</div></div></section>
    <section className="catalog" {...sectionColorProps(sectionColors, 'catalog')} aria-labelledby="catalog-title"><p className="eyebrow">MOSTRUÁRIO</p><h2 id="catalog-title">ESCOLHA SEU PRODUTO</h2><div className="catalog-grid">{catalogProducts.map((product) => <article className="catalog-card" key={product.id}><div className="catalog-media">{product.imageUrl && (product.imageUrl.startsWith('/') ? <Image src={webpSource(product.imageUrl)} alt={product.name} fill sizes="(max-width: 700px) 50vw, 300px" /> : <img src={product.imageUrl} alt={product.name} loading="lazy" />)}</div><div className="catalog-info"><h3>{product.name}</h3><p>{product.detail}</p><p className="catalog-description">{product.description}</p><div className="catalog-price"><strong>{formatPrice(product.price)}</strong><a href={getWhatsAppUrl(product.name)} target="_blank" rel="noreferrer" aria-label={`Pedir ${product.name} pelo WhatsApp`}><FaWhatsapp /></a></div></div></article>)}<a className="catalog-contact-card" href={whatsappUrl} target="_blank" rel="noreferrer"><FaWhatsapp /><span>Presentes? Casamentos?<br />Pedidos personalizados?</span><strong>FALE CONOSCO</strong></a></div></section>
    <section className="story" {...sectionColorProps(sectionColors, 'story')} id="historia" aria-labelledby="story-title"><div className="story-copy"><p className="eyebrow">NOSSA HISTÓRIA</p><h2 id="story-title">Toda história tem uma origem. E a nossa começa aqui.</h2><p>Somos três mulheres unidas pelo amor, pelo cuidado e pelo desejo de levar bem-estar para a vida das pessoas.</p><p>Eu, Laura, ao lado da minha mãe Kerli e irmã Maria Clara, damos vida à Finessência: uma marca que nasceu do coração, da conexão com a natureza e da crença de que pequenos momentos podem transformar os nossos dias.</p><p className="story-welcome">Sejam muito bem-vindos à nossa essência. Que este seja um espaço de acolhimento, leveza e boas energias.</p></div><div className="story-image"><Image src="/familia.webp" alt="Laura, Kerli e Maria Clara, fundadoras da Finessência" fill sizes="(max-width: 700px) 100vw, 50vw" /></div></section>
    <section className="about" {...sectionColorProps(sectionColors, 'about')} id="essencia"><div className="about-copy"><p className="eyebrow">NOSSA ESSÊNCIA</p><h2>Feito para transformar ambientes em momentos.</h2><p>Na Finessência, cada criação une fragrâncias marcantes, beleza e delicadeza. São detalhes artesanais pensados para acolher a rotina e criar memórias afetivas.</p></div></section>
    <div className="footer-brand-echo" {...sectionColorProps(sectionColors, 'brand')} aria-hidden="true"><span>FINESSENCIA</span></div>
    <footer id="contato" {...sectionColorProps(sectionColors, 'footer')}><span className="footer-message">Feito com delicadeza para o seu momento.</span><div className="footer-actions"><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a></div></footer>
  </main>
}
