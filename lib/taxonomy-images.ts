export type TaxonomyKind = 'categories' | 'essences'
export type TaxonomyImages = { name: string; image: string | null; hoverImage: string | null }
export const taxonomyDefaults: Record<TaxonomyKind, TaxonomyImages[]> = {
  "essences": [
    {
      "name": "Alecrim",
      "image": "/essencias/Alecrim Arco.webp",
      "hoverImage": "/essencias_clique/Alecrim.webp"
    },
    {
      "name": "Capim Limão",
      "image": "/essencias/Capim limão Arco.webp",
      "hoverImage": "/essencias_clique/Capim limão.webp"
    },
    {
      "name": "Flor de Figo",
      "image": "/essencias/Flor de figo Arco.webp",
      "hoverImage": "/essencias_clique/Flor de Figo.webp"
    },
    {
      "name": "Laranjeira",
      "image": "/essencias/Laranjeira Arco.webp",
      "hoverImage": "/essencias_clique/Laranjeira.webp"
    },
    {
      "name": "Lavanda",
      "image": "/essencias/Lavanda Arco.webp",
      "hoverImage": "/essencias_clique/Lavanda.webp"
    },
    {
      "name": "Cereja e Avelã",
      "image": "/essencias/Cereja e Avelã Arco.webp",
      "hoverImage": "/essencias_clique/Cereja e Avelã.webp"
    },
    {
      "name": "Daslu",
      "image": "/essencias/Daslu Arco.webp",
      "hoverImage": "/essencias_clique/Daslu.webp"
    },
    {
      "name": "Limão Siciliano",
      "image": "/essencias/Limão Siciliano Arco.webp",
      "hoverImage": "/essencias_clique/Limão Siciliano.webp"
    },
    {
      "name": "Maçã com Canela",
      "image": "/essencias/Maça com Canela Arco.webp",
      "hoverImage": "/essencias_clique/Maça com Canela.webp"
    }
  ],
  "categories": [
    {
      "name": "Velas",
      "image": "/essencias_clique/Velas.webp",
      "hoverImage": null
    },
    {
      "name": "Home Spray",
      "image": "/essencias_clique/Home Spray.webp",
      "hoverImage": null
    },
    {
      "name": "Difusores",
      "image": "/essencias_clique/Difusores.webp",
      "hoverImage": null
    },
    {
      "name": "Blends",
      "image": "/essencias_clique/Blend Aromático.webp",
      "hoverImage": null
    },
    {
      "name": "Escalda Pés",
      "image": "/essencias_clique/Escalda pés.webp",
      "hoverImage": null
    },
    {
      "name": "Rechauds",
      "image": "/essencias_clique/Velas.webp",
      "hoverImage": null
    },
    {
      "name": "Sabonetes",
      "image": "/essencias_clique/Sabonete Artesanal.webp",
      "hoverImage": null
    }
  ]
}
export function defaultTaxonomyImages(kind: TaxonomyKind, name: string) {
  return taxonomyDefaults[kind].find(item => item.name.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))
}
