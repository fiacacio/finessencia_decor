const CACHE = 'finessencia-v3'
const SHELL = ['/manifest.webmanifest', '/Icone2.ico']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)))
  self.skipWaiting()
})
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('finessencia-') && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())))
self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  if (request.destination === 'document') {
    event.respondWith(fetch(request).catch(() => caches.match('/')))
    return
  }
  if (!['style', 'script', 'image', 'font'].includes(request.destination)) return
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    // Range/media responses (206) are not valid Cache API entries.
    if (response.status === 200 && response.type === 'basic') {
      const copy = response.clone()
      void caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {})
    }
    return response
  })))
})
