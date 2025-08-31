import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'clickky app',
    short_name: 'Clickky',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    "icons": [
      {
        "src": "/icons/512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
}