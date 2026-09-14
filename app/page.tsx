<<<<<<< Updated upstream
import { TouchCarousels } from '@/components/touch-carousels'
import { FilterableCatalog } from '@/components/filterable-catalog'
=======
import { sectionProps, sectionText, type SectionContent } from '@/lib/section-content'
import { CustomerPopup } from '@/components/customer-popup'
import { defaultCustomerPopup } from '@/lib/customer-popup'
import { getCustomerPopup } from '@/services/customers'
import { taxonomyDefaults } from '@/lib/taxonomy-images'
import { getTaxonomies } from '@/services/taxonomies'
import { type SectionColors } from '@/lib/section-colors'
import { getSectionSettings } from '@/services/section-colors'
import { defaultSpraySettings } from '@/lib/spray-settings'
import { getSpraySettings } from '@/services/spray-settings'
import { AnnouncementBar } from '@/components/announcement-bar'
import { defaultAnnouncement } from '@/lib/announcement'
import { getAnnouncement } from '@/services/announcement'
>>>>>>> Stashed changes
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6'
import Image from 'next/image'
import { EffectsController } from '@/components/effects-controller'
import { LoadingScreen } from '@/components/loading-screen'
import { fallbackCatalogProducts } from '@/lib/products'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getProducts } from '@/services/products'

const instagramUrl = 'https://www.instagram.com/finessenciadecor/'
const whatsappUrl = 'https://wa.me/5519993962062'
const products = [
  { name: 'Alecrim', image: '/essencias/Alecrim Arco.png', hoverImage: '/essencias_clique/Alecrim.jfif' },
  { name: 'Capim Limão', image: '/essencias/Capim limão Arco.png', hoverImage: '/essencias_clique/Capim limão.jfif' },
  { name: 'Flor de Figo', image: '/essencias/Flor de figo Arco.png', hoverImage: '/essencias_clique/Flor de Figo.jfif' },
  { name: 'Laranjeira', image: '/essencias/Laranjeira Arco.png', hoverImage: '/essencias_clique/Laranjeira.jfif' },
  { name: 'Lavanda', image: '/essencias/Lavanda Arco.png', hoverImage: '/essencias_clique/Lavanda.jfif' },
  { name: 'Cereja e Avelã', image: '/essencias/Cereja e Avelã Arco.png', hoverImage: '/essencias_clique/Cereja e Avelã.jfif' },
  { name: 'Daslu', image: '/essencias/Daslu Arco.png', hoverImage: '/essencias_clique/Daslu.jfif' },
  { name: 'Limão Siciliano', image: '/essencias/Limão Siciliano Arco.png', hoverImage: '/essencias_clique/Limão Siciliano.jfif' },
  { name: 'Maçã com Canela', image: '/essencias/Maça com Canela Arco.png', hoverImage: '/essencias_clique/Maça com Canela.jfif' },
]

const productShowcase = [
  { name: 'Velas', image: '/essencias_clique/Velas.jfif' },
  { name: 'Home Spray', image: '/essencias_clique/Home Spray.jfif' },
  { name: 'Difusores', image: '/essencias_clique/Difusores.jfif' },
  { name: 'Blends', image: '/essencias_clique/Blend Aromático.jfif' },
  { name: 'Escalda Pés', image: '/essencias_clique/Escalda pés.jfif' },
  { name: 'Rechauds', image: '/essencias_clique/Velas.jfif' },
  { name: 'Sabonetes', image: '/essencias_clique/Sabonete Artesanal.jfif' },
]

const webpSource = (source: string) => source.replace(/\.(png|jpe?g|jfif)$/i, '.webp')

export const dynamic = 'force-dynamic'

export default async function Page() {
<<<<<<< Updated upstream
=======
  let customerPopup = defaultCustomerPopup
  let products = taxonomyDefaults.essences
  let productShowcase = taxonomyDefaults.categories
  let sectionColors: SectionColors = {}
  let sectionContent: SectionContent = {}
  let spraySettings = defaultSpraySettings
  let announcement = defaultAnnouncement
>>>>>>> Stashed changes
  let catalogProducts = fallbackCatalogProducts
  if (isSupabaseConfigured) {
    const [popup, essences, categories, colors, spray, bar, catalog] = await Promise.allSettled([
      getCustomerPopup(), getTaxonomies('essences'), getTaxonomies('categories'),
      getSectionSettings(), getSpraySettings(), getAnnouncement(), getProducts(true),
    ])
    const toShowcase = (items: Awaited<ReturnType<typeof getTaxonomies>>) => items.map(item => ({name:item.name,image:item.imageUrl,hoverImage:item.hoverImageUrl}))
    if (popup.status === 'fulfilled') customerPopup = popup.value
    if (essences.status === 'fulfilled') products = toShowcase(essences.value)
    if (categories.status === 'fulfilled') productShowcase = toShowcase(categories.value)
    if (colors.status === 'fulfilled') { sectionColors = colors.value.colors; sectionContent = colors.value.content }
    if (spray.status === 'fulfilled') spraySettings = spray.value
    if (bar.status === 'fulfilled') announcement = bar.value
    if (catalog.status === 'fulfilled') catalogProducts = catalog.value
  }
  return <main className="site-shell">
<<<<<<< Updated upstream
    <LoadingScreen /><TouchCarousels />
    <EffectsController />
    <div className="shipping-bar">✦ &nbsp; FRETE GRÁTIS PARA PEDIDOS ACIMA DE R$ 199 &nbsp; ✦</div>
    <header className="site-header"><div className="top-row">
      <a className="brand" href="#inicio" aria-label="Finessência — início"><img src="/Logo PNG Caramelo.png" alt="Finessência decor aromático" /></a>
      <div className="header-actions"><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a></div>
    </div></header>
    <section className="hero" id="inicio"><div className="hero-background" aria-hidden="true" /><span className="hero-botanical hero-botanical--large" aria-hidden="true" /><span className="hero-botanical hero-botanical--small" aria-hidden="true" /><div className="hero-image"><video autoPlay loop muted playsInline preload="metadata" poster="/abertura-poster.webp" aria-label="Vídeo de abertura da Finessência"><source src="/abertura.webm" type="video/webm" /><source src="/abertura.mp4" type="video/mp4" /></video></div><div className="hero-copy"><p className="eyebrow">DECOR AROMÁTICO</p><h1>ACENDA<br />O MOMENTO</h1><span className="rule" /><p>ESSÊNCIAS QUE TRANSFORMAM<br />AMBIENTES EM MEMÓRIAS.</p><a className="button primary" href="#colecao"><span>CONHEÇA A COLEÇÃO</span></a></div></section>
    <section className="welcome"><h2>BEM-VINDA À FINESSÊNCIA</h2><p>Uma pausa para sentir, acolher e transformar. Criamos aromas e detalhes que fazem de cada ambiente um lugar ainda mais seu.</p></section>
    <section className="arrivals" id="colecao"><p className="eyebrow">NOSSAS ESSÊNCIAS</p><h2>ESCOLHAS PARA SENTIR</h2><div className="product-grid"><div className="product-track">{[false, true].map((isDuplicate) => <div className="product-set" aria-hidden={isDuplicate} key={String(isDuplicate)}>{products.map((product) => <article className={`product${product.name === 'Flor de Figo' ? ' product--fig' : ''}`} key={`${product.name}-${isDuplicate}`}><div className="product-media"><Image className="product-primary-image" src={webpSource(product.image)} alt={isDuplicate ? '' : `Essência ${product.name}`} fill sizes="(max-width: 700px) 50vw, 300px" />{product.hoverImage && <Image className="product-hover-image" src={webpSource(product.hoverImage)} alt="" fill sizes="(max-width: 700px) 50vw, 300px" />}</div><h3>{product.name}</h3></article>)}</div>)}</div></div></section>
    <FilterableCatalog catalogProducts={catalogProducts} productShowcase={productShowcase} />
    <section className="story" id="historia" aria-labelledby="story-title"><div className="story-copy"><p className="eyebrow">NOSSA HISTÓRIA</p><h2 id="story-title">Toda história tem uma origem. E a nossa começa aqui.</h2><p>Somos três mulheres unidas pelo amor, pelo cuidado e pelo desejo de levar bem-estar para a vida das pessoas.</p><p>Eu, Laura, ao lado da minha mãe Kerli e irmã Maria Clara, damos vida à Finessência: uma marca que nasceu do coração, da conexão com a natureza e da crença de que pequenos momentos podem transformar os nossos dias.</p><p className="story-welcome">Sejam muito bem-vindos à nossa essência. Que este seja um espaço de acolhimento, leveza e boas energias.</p></div><div className="story-image"><Image src="/familia.webp" alt="Laura, Kerli e Maria Clara, fundadoras da Finessência" fill sizes="(max-width: 700px) 100vw, 50vw" /></div></section>
    <section className="about" id="essencia"><div className="about-copy"><p className="eyebrow">NOSSA ESSÊNCIA</p><h2>Feito para transformar ambientes em momentos.</h2><p>Na Finessência, cada criação une fragrâncias marcantes, beleza e delicadeza. São detalhes artesanais pensados para acolher a rotina e criar memórias afetivas.</p></div></section>
    <div className="footer-brand-echo" aria-hidden="true"><span>FINESSENCIA</span></div>
    <footer id="contato"><span className="footer-message">Feito com delicadeza para o seu momento.</span><div className="footer-actions"><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a></div></footer>
=======
    <LoadingScreen />
    {customerPopup.enabled && <CustomerPopup settings={customerPopup} />}
    <EffectsController spraySettings={spraySettings} />
    <AnnouncementBar settings={sectionColors.announcement ? { ...announcement, color: sectionColors.announcement } : announcement} />
    <header className="site-header" {...sectionProps(sectionColors, sectionContent, 'header')}><div className="top-row">
      <a className="brand" href="#inicio" aria-label="Finessência — início"><img src="/Logo PNG Caramelo.png" alt="Finessência decor aromático" /></a>
      <div className="header-actions"><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a></div>
    </div></header>
    <section className="hero" {...sectionProps(sectionColors, sectionContent, 'hero')} id="inicio"><div className="hero-background" aria-hidden="true" /><span className="hero-botanical hero-botanical--large" aria-hidden="true" /><span className="hero-botanical hero-botanical--small" aria-hidden="true" /><div className="hero-image"><video autoPlay loop muted playsInline preload="metadata" poster="/abertura-poster.webp" aria-label="Vídeo de abertura da Finessência"><source src="/abertura.webm" type="video/webm" /><source src="/abertura.mp4" type="video/mp4" /></video><div className="hero-video-ending" aria-hidden="true"><img src="/Logo PNG Branco.png" alt="" /></div></div><div className="hero-copy"><p className="eyebrow">{sectionText(sectionContent, 'hero', 'subtitle')}</p><h1>{sectionText(sectionContent, 'hero', 'title')}</h1><span className="rule" /><p>{sectionText(sectionContent, 'hero', 'text')}</p><a className="button primary" href="#colecao"><span>{sectionText(sectionContent, 'hero', 'button')}</span></a></div></section>
    <section className="welcome" {...sectionProps(sectionColors, sectionContent, 'welcome')}>{sectionText(sectionContent, 'welcome', 'subtitle') && <p className="eyebrow">{sectionText(sectionContent, 'welcome', 'subtitle')}</p>}<h2>{sectionText(sectionContent, 'welcome', 'title')}</h2><p>{sectionText(sectionContent, 'welcome', 'text')}</p></section>
    <section className="arrivals" {...sectionProps(sectionColors, sectionContent, 'arrivals')} id="colecao"><p className="eyebrow">{sectionText(sectionContent, 'arrivals', 'subtitle')}</p><h2>{sectionText(sectionContent, 'arrivals', 'title')}</h2>{sectionText(sectionContent, 'arrivals', 'text') && <p className="section-intro">{sectionText(sectionContent, 'arrivals', 'text')}</p>}<div className="product-grid"><div className="product-track">{[false, true].map((isDuplicate) => <div className="product-set" aria-hidden={isDuplicate} key={String(isDuplicate)}>{products.map((product) => <article className={`product${product.hoverImage ? ' has-hover-image' : ''}${product.name === 'Flor de Figo' ? ' product--fig' : ''}`} key={`${product.name}-${isDuplicate}`}><div className="product-media"><Image className="product-primary-image" src={product.image || '/Logo PNG Caramelo.png'} alt={isDuplicate ? '' : `Essência ${product.name}`} fill sizes="(max-width: 700px) 50vw, 300px" />{product.hoverImage && <Image className="product-hover-image" src={product.hoverImage} alt="" fill sizes="(max-width: 700px) 50vw, 300px" />}</div><h3>{product.name}</h3></article>)}</div>)}</div></div></section>
    <section className="showcase" {...sectionProps(sectionColors, sectionContent, 'showcase')} aria-labelledby="showcase-title"><p className="eyebrow">{sectionText(sectionContent, 'showcase', 'subtitle')}</p><h2 id="showcase-title">{sectionText(sectionContent, 'showcase', 'title')}</h2>{sectionText(sectionContent, 'showcase', 'text') && <p className="section-intro">{sectionText(sectionContent, 'showcase', 'text')}</p>}<div className="showcase-grid"><div className="showcase-track">{[false, true].map((isDuplicate) => <div className="showcase-set" aria-hidden={isDuplicate} key={String(isDuplicate)}>{productShowcase.map((product) => <article className={`showcase-card${product.hoverImage ? ' has-hover-image' : ''}`} key={`${product.name}-${isDuplicate}`}><div className="showcase-media"><Image className="showcase-primary-image" src={product.image || '/Logo PNG Caramelo.png'} alt={isDuplicate ? '' : `Categoria ${product.name}`} fill sizes="(max-width: 700px) 85vw, 300px" />{product.hoverImage && <Image className="showcase-hover-image" src={product.hoverImage} alt="" fill sizes="(max-width: 700px) 85vw, 300px" />}</div><h3>{product.name}</h3></article>)}</div>)}</div></div></section>
    <section className="catalog" {...sectionProps(sectionColors, sectionContent, 'catalog')} aria-labelledby="catalog-title"><p className="eyebrow">{sectionText(sectionContent, 'catalog', 'subtitle')}</p><h2 id="catalog-title">{sectionText(sectionContent, 'catalog', 'title')}</h2>{sectionText(sectionContent, 'catalog', 'text') && <p className="section-intro">{sectionText(sectionContent, 'catalog', 'text')}</p>}<div className="catalog-grid">{catalogProducts.map((product) => <article className="catalog-card" key={product.id}><div className="catalog-media">{product.imageUrl && (product.imageUrl.startsWith('/') ? <Image src={webpSource(product.imageUrl)} alt={product.name} fill sizes="(max-width: 700px) 50vw, 300px" /> : <img src={product.imageUrl} alt={product.name} loading="lazy" />)}</div><div className="catalog-info"><h3>{product.name}</h3><p>{product.detail}</p><p className="catalog-description">{product.description}</p><div className="catalog-price"><strong>{formatPrice(product.price)}</strong><a href={getWhatsAppUrl(product.name)} target="_blank" rel="noreferrer" aria-label={`Pedir ${product.name} pelo WhatsApp`}><FaWhatsapp /></a></div></div></article>)}<a className="catalog-contact-card" href={whatsappUrl} target="_blank" rel="noreferrer"><FaWhatsapp /><span>Presentes? Casamentos?<br />Pedidos personalizados?</span><strong>FALE CONOSCO</strong></a></div></section>
    <section className="story" {...sectionProps(sectionColors, sectionContent, 'story')} id="historia" aria-labelledby="story-title"><div className="story-copy"><p className="eyebrow">{sectionText(sectionContent, 'story', 'subtitle')}</p><h2 id="story-title">{sectionText(sectionContent, 'story', 'title')}</h2><p>{sectionText(sectionContent, 'story', 'text')}</p><p>{sectionText(sectionContent, 'story', 'text2')}</p><p className="story-welcome">{sectionText(sectionContent, 'story', 'text3')}</p></div><div className="story-image"><Image src="/familia.webp" alt="Laura, Kerli e Maria Clara, fundadoras da Finessência" fill sizes="(max-width: 700px) 100vw, 50vw" /></div></section>
    <section className="about" {...sectionProps(sectionColors, sectionContent, 'about')} id="essencia"><div className="about-copy"><p className="eyebrow">{sectionText(sectionContent, 'about', 'subtitle')}</p><h2>{sectionText(sectionContent, 'about', 'title')}</h2><p>{sectionText(sectionContent, 'about', 'text')}</p></div></section>
    <div className="footer-brand-echo" {...sectionProps(sectionColors, sectionContent, 'brand')} aria-hidden="true"><span>FINESSENCIA</span></div>
    <footer id="contato" {...sectionProps(sectionColors, sectionContent, 'footer')}><span className="footer-message">{sectionText(sectionContent, 'footer', 'text')}</span><div className="footer-actions"><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a></div></footer>
>>>>>>> Stashed changes
  </main>
}
