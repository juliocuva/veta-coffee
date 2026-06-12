export default function manifest() {
  return {
    name: 'beCOFFEE.pro',
    short_name: 'beCOFFEE',
    description: 'Gestiona tu catálogo de café de especialidad y recibe pedidos directo a tu WhatsApp.',
    start_url: '/admin',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FAF7F2',
    theme_color: '#005C38',
    lang: 'es',
    categories: ['food', 'shopping', 'business'],
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-catalog.png',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Catálogo de café de especialidad',
      },
      {
        src: '/screenshot-drawer.png',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Carrito de pedido',
      },
      {
        src: '/screenshot-whatsapp.png',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Pedido por WhatsApp',
      },
    ],
  }
}
