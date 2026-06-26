import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Crafyne — Software Studio',
    short_name: 'Crafyne',
    description: 'A small, senior team of engineers and designers building software for people who care how it feels.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF6EE',
    theme_color: '#B91C1C',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
