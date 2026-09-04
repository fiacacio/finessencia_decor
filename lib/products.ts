export type ProductStatus = 'active' | 'inactive'

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: string | null
  essence: string | null
  imageUrl: string | null
  detail: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type ProductInput = {
  name: string
  description: string
  price: number
  category: string
  essence: string
  detail: string
  active: boolean
  imageUrl: string | null
}

type ProductRow = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number | string
  category: string | null
  essence: string | null
  image_url: string | null
  detail: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export const mapProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  price: Number(row.price),
  category: row.category,
  essence: row.essence,
  imageUrl: row.image_url,
  detail: row.detail,
  active: row.active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const productToRow = (product: ProductInput) => ({
  name: product.name.trim(),
  description: product.description.trim() || null,
  price: product.price,
  category: product.category.trim() || null,
  essence: product.essence.trim() || null,
  detail: product.detail.trim() || null,
  image_url: product.imageUrl,
  active: product.active,
})

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

export const fallbackCatalogProducts: Product[] = [
  { id: 'vela-aromatica', name: 'Vela Aromática', slug: 'vela-aromatica', detail: '120 g', description: 'Aroma acolhedor para momentos de pausa.', price: 39.9, category: 'Velas', essence: null, imageUrl: '/essencias_clique/Velas.jfif', active: true, createdAt: '', updatedAt: '' },
  { id: 'home-spray', name: 'Home Spray', slug: 'home-spray', detail: '250 ml', description: 'Perfuma seu espaço com leveza e frescor.', price: 49.9, category: 'Home Spray', essence: null, imageUrl: '/essencias_clique/Home Spray.jfif', active: true, createdAt: '', updatedAt: '' },
  { id: 'difusor-de-ambientes', name: 'Difusor de Ambientes', slug: 'difusor-de-ambientes', detail: '200 ml', description: 'Fragrância contínua para acolher o ambiente.', price: 59.9, category: 'Difusores', essence: null, imageUrl: '/essencias_clique/Difusores.jfif', active: true, createdAt: '', updatedAt: '' },
  { id: 'blend-aromatico', name: 'Blend Aromático', slug: 'blend-aromatico', detail: '50 g', description: 'Mistura aromática para rituais sensoriais.', price: 29.9, category: 'Blends', essence: null, imageUrl: '/essencias_clique/Blend Aromático.jfif', active: true, createdAt: '', updatedAt: '' },
  { id: 'escalda-pes', name: 'Escalda-Pés', slug: 'escalda-pes', detail: '150 g', description: 'Cuidado e relaxamento em cada pausa.', price: 34.9, category: 'Escalda Pés', essence: null, imageUrl: '/essencias_clique/Escalda pés.jfif', active: true, createdAt: '', updatedAt: '' },
  { id: 'sabonete-artesanal', name: 'Sabonete Artesanal', slug: 'sabonete-artesanal', detail: '100 g', description: 'Limpeza delicada e perfumada para a rotina.', price: 22.9, category: 'Sabonetes', essence: null, imageUrl: '/essencias_clique/Sabonete Artesanal.jfif', active: true, createdAt: '', updatedAt: '' },
]
