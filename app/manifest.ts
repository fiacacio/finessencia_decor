import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Finessência — Decor aromático',
    short_name: 'Finessência',
    description: 'Essências que transformam ambientes em memórias.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf6f0',
    theme_color: '#3a2419',
    lang: 'pt-BR',
    icons: [{ src: '/icon.ico', sizes: 'any', type: 'image/x-icon', purpose: 'any' }],
  }
}
