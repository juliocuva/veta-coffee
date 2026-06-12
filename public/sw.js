// beCOFFEE.pro — Service Worker
// Estrategia: Network First con fallback a caché
// El tostador siempre ve datos frescos. Si no hay red, ve la última versión visitada.

const CACHE_NAME = 'becoffee-v1'

// Shell de la app: recursos que se precachean al instalar
const PRECACHE_URLS = [
  '/admin',
  '/admin/dashboard',
]

// ─── Install ──────────────────────────────────────────────────────────────────
// Se ejecuta una sola vez cuando el SW se registra por primera vez.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS)
    }).catch(() => {
      // Si el precacheo falla (ej: sin internet al instalar), no bloquear
    })
  )
  // Activa el nuevo SW inmediatamente sin esperar a que cierren las pestañas
  self.skipWaiting()
})

// ─── Activate ─────────────────────────────────────────────────────────────────
// Limpia cachés de versiones anteriores del SW.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  // Toma control de todas las pestañas abiertas inmediatamente
  self.clients.claim()
})

// ─── Fetch ────────────────────────────────────────────────────────────────────
// Network First: intenta la red, si falla usa caché.
self.addEventListener('fetch', (event) => {
  // Solo intercepta requests GET de la misma origin
  if (
    event.request.method !== 'GET' ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return
  }

  // No interceptar las llamadas a la API de Supabase
  if (event.request.url.includes('supabase.co')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la red responde bien, guarda una copia en caché y devuelve la respuesta
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return networkResponse
      })
      .catch(() => {
        // Sin red → busca en caché
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // Sin red y sin caché: devuelve respuesta vacía
          return new Response('Sin conexión', {
            status: 503,
            statusText: 'Service Unavailable',
          })
        })
      })
  )
})
