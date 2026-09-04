import { FaInstagram, FaWhatsapp } from 'react-icons/fa6'
import { LoadingScreen } from '@/components/loading-screen'
import { fallbackCatalogProducts, formatPrice } from '@/lib/products'
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

const getWhatsAppUrl = (productName: string) => `https://wa.me/5519993962062?text=${encodeURIComponent(`Olá! Tenho interesse no produto ${productName}.`)}`

export const dynamic = 'force-dynamic'

export default async function Page() {
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
    <div className="shipping-bar">✦ &nbsp; FRETE GRÁTIS PARA PEDIDOS ACIMA DE R$ 199 &nbsp; ✦</div>
    <header className="site-header"><div className="top-row">
      <a className="brand" href="#inicio" aria-label="Finessência — início"><img src="/Logo PNG Caramelo.png" alt="Finessência decor aromático" /></a>
      <div className="header-actions"><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a></div>
    </div></header>
    <section className="hero" id="inicio"><div className="hero-image"><video autoPlay loop muted playsInline preload="metadata" aria-label="Vídeo de abertura da Finessência"><source src="/abertura.mp4" type="video/mp4" /></video></div><div className="hero-copy"><p className="eyebrow">DECOR AROMÁTICO</p><h1>ACENDA<br />O MOMENTO</h1><span className="rule" /><p>ESSÊNCIAS QUE TRANSFORMAM<br />AMBIENTES EM MEMÓRIAS.</p><a className="button primary" href="#colecao">CONHEÇA A COLEÇÃO</a></div></section>
    <section className="welcome"><h2>BEM-VINDA À FINESSÊNCIA</h2><p>Uma pausa para sentir, acolher e transformar. Criamos aromas e detalhes que fazem de cada ambiente um lugar ainda mais seu.</p></section>
    <section className="arrivals" id="colecao"><p className="eyebrow">NOSSAS ESSÊNCIAS</p><h2>ESCOLHAS PARA SENTIR</h2><div className="product-grid"><div className="product-track">{[false, true].map((isDuplicate) => <div className="product-set" aria-hidden={isDuplicate} key={String(isDuplicate)}>{products.map((product) => <article className={`product${product.name === 'Flor de Figo' ? ' product--fig' : ''}`} key={`${product.name}-${isDuplicate}`}><div className="product-media"><img className="product-primary-image" src={product.image} alt={isDuplicate ? '' : `Essência ${product.name}`} />{product.hoverImage && <img className="product-hover-image" src={product.hoverImage} alt="" />}</div><h3>{product.name}</h3></article>)}</div>)}</div></div></section>
    <section className="showcase" aria-labelledby="showcase-title"><p className="eyebrow">CATEGORIAS</p><h2 id="showcase-title">ENCONTRE O SEU RITUAL</h2><div className="showcase-grid"><div className="showcase-track">{[false, true].map((isDuplicate) => <div className="showcase-set" aria-hidden={isDuplicate} key={String(isDuplicate)}>{productShowcase.map((product) => <article className="showcase-card" key={`${product.name}-${isDuplicate}`}><div className="showcase-media"><img src={product.image} alt={isDuplicate ? '' : `Categoria ${product.name}`} /></div><h3>{product.name}</h3></article>)}</div>)}</div></div></section>
    <section className="catalog" aria-labelledby="catalog-title"><p className="eyebrow">MOSTRUÁRIO</p><h2 id="catalog-title">ESCOLHA SEU PRODUTO</h2><div className="catalog-grid">{catalogProducts.map((product) => <article className="catalog-card" key={product.id}><div className="catalog-media">{product.imageUrl && <img src={product.imageUrl} alt={product.name} />}</div><div className="catalog-info"><h3>{product.name}</h3><p>{product.detail}</p><p className="catalog-description">{product.description}</p><div className="catalog-price"><strong>{formatPrice(product.price)}</strong><a href={getWhatsAppUrl(product.name)} target="_blank" rel="noreferrer" aria-label={`Pedir ${product.name} pelo WhatsApp`}><FaWhatsapp /></a></div></div></article>)}<a className="catalog-contact-card" href={whatsappUrl} target="_blank" rel="noreferrer"><FaWhatsapp /><span>NÃO ENCONTROU O QUE PROCURA?</span><strong>FALE CONOSCO</strong></a></div></section>
    <section className="story" id="historia" aria-labelledby="story-title"><div className="story-copy"><p className="eyebrow">NOSSA HISTÓRIA</p><h2 id="story-title">Toda história tem uma origem. E a nossa começa aqui.</h2><p>Somos três mulheres unidas pelo amor, pelo cuidado e pelo desejo de levar bem-estar para a vida das pessoas.</p><p>Eu, Laura, ao lado da minha mãe Kerli e irmã Maria Clara, damos vida à Finessência: uma marca que nasceu do coração, da conexão com a natureza e da crença de que pequenos momentos podem transformar os nossos dias.</p><p className="story-welcome">Sejam muito bem-vindos à nossa essência. Que este seja um espaço de acolhimento, leveza e boas energias.</p></div><div className="story-image"><img src="/familia.png" alt="Laura, Kerli e Maria Clara, fundadoras da Finessência" /></div></section>
    <section className="about" id="essencia"><div className="about-copy"><p className="eyebrow">NOSSA ESSÊNCIA</p><h2>Feito para transformar ambientes em momentos.</h2><p>Na Finessência, cada criação une fragrâncias marcantes, beleza e delicadeza. São detalhes artesanais pensados para acolher a rotina e criar memórias afetivas.</p></div></section>
    <footer id="contato"><img src="/Logo PNG Branco.png" alt="Finessência decor aromático" /><span className="footer-message">Feito com delicadeza para o seu momento.</span><div className="footer-actions"><a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a></div></footer>
  </main>
}
