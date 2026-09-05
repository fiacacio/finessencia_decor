export type ProductStatus = 'active' | 'inactive'
export type ProductTaxonomy = { id: string; name: string }
export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  categoryId: string
  category: string
  essences: ProductTaxonomy[]
  allEssences: boolean
  imageUrl: string | null
  detail: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}
// Presentation examples have no persisted taxonomy IDs or confirmed availability.
export type CatalogProduct = Omit<Product, 'categoryId'>
export type ProductInput = {
  name: string
  description: string
  price: number
  categoryId: string
  essenceIds: string[]
  allEssences: boolean
  detail: string
  active: boolean
  imageUrl: string | null
}
type ProductRow = {
  id: string; name: string; slug: string; description: string | null
  price: number | string; category_id: string; all_essences: boolean
  category: ProductTaxonomy
  product_essences: { essence: ProductTaxonomy }[]
  image_url: string | null; detail: string | null; active: boolean
  created_at: string; updated_at: string
}
export const mapProduct = (row: ProductRow): Product => ({
  id: row.id, name: row.name, slug: row.slug, description: row.description,
  price: Number(row.price), categoryId: row.category_id, category: row.category.name,
  essences: row.product_essences.map(link => link.essence).sort((a,b) => a.name.localeCompare(b.name)),
  allEssences: row.all_essences, imageUrl: row.image_url, detail: row.detail,
  active: row.active, createdAt: row.created_at, updatedAt: row.updated_at,
})
export const essenceLabel = (product: Pick<Product, 'essences' | 'allEssences'>) =>
  product.allEssences ? 'Disponível em todas as essências' : product.essences.map(e => e.name).join(', ')

export const productToRow = (product: ProductInput) => {
  if (!product.name.trim()) throw new Error('Informe o nome do produto.')
  if (!Number.isFinite(product.price) || product.price < 0) throw new Error('Informe um preço válido.')
  if (!product.categoryId) throw new Error('Selecione uma categoria.')
  if (!product.allEssences && !product.essenceIds.length) throw new Error('Selecione pelo menos uma essência ou a opção de todas as essências.')
  return {
    name: product.name.trim(), description: product.description.trim() || null,
    price: product.price, category_id: product.categoryId,
    all_essences: product.allEssences,
    essence_ids: product.allEssences ? [] : [...new Set(product.essenceIds)],
    detail: product.detail.trim() || null, image_url: product.imageUrl, active: product.active,
  }
}
export const formatPrice = (price: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

export const fallbackCatalogProducts: CatalogProduct[] = [
  { id: 'vela-aromatica', name: 'Vela Aromática', slug: 'vela-aromatica', detail: '120 g', description: 'Aroma acolhedor para momentos de pausa.', price: 39.9, category: 'Velas', essences: [], allEssences: false, imageUrl: '/essencias_clique/Velas.jfif', active: true, createdAt: '', updatedAt: '' },
  { id: 'home-spray', name: 'Home Spray', slug: 'home-spray', detail: '250 ml', description: 'Perfuma seu espaço com leveza e frescor.', price: 49.9, category: 'Home Spray', essences: [], allEssences: false, imageUrl: '/essencias_clique/Home Spray.jfif', active: true, createdAt: '', updatedAt: '' },
  { id: 'difusor-de-ambientes', name: 'Difusor de Ambientes', slug: 'difusor-de-ambientes', detail: '200 ml', description: 'Fragrância contínua para acolher o ambiente.', price: 59.9, category: 'Difusores', essences: [], allEssences: false, imageUrl: '/essencias_clique/Difusores.jfif', active: true, createdAt: '', updatedAt: '' },
  { id: 'blend-aromatico', name: 'Blend Aromático', slug: 'blend-aromatico', detail: '50 g', description: 'Mistura aromática para rituais sensoriais.', price: 29.9, category: 'Blends', essences: [], allEssences: false, imageUrl: '/essencias_clique/Blend Aromático.jfif', active: true, createdAt: '', updatedAt: '' },
  { id: 'escalda-pes', name: 'Escalda-Pés', slug: 'escalda-pes', detail: '150 g', description: 'Cuidado e relaxamento em cada pausa.', price: 34.9, category: 'Escalda Pés', essences: [], allEssences: false, imageUrl: '/essencias_clique/Escalda pés.jfif', active: true, createdAt: '', updatedAt: '' },
  { id: 'sabonete-artesanal', name: 'Sabonete Artesanal', slug: 'sabonete-artesanal', detail: '100 g', description: 'Limpeza delicada e perfumada para a rotina.', price: 22.9, category: 'Sabonetes', essences: [], allEssences: false, imageUrl: '/essencias_clique/Sabonete Artesanal.jfif', active: true, createdAt: '', updatedAt: '' },
]
