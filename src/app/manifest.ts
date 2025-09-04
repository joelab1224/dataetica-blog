import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DataÉtica Blog - Exploring Digital Ethics',
    short_name: 'DataÉtica',
    description: 'Exploring ethics in the digital age through critical analysis and research on AI, data privacy, and technology ethics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#7c3aed',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en-US',
    categories: ['education', 'news', 'lifestyle', 'productivity'],
    icons: [
      {
        src: '/logo1.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo1.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo1.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Latest Articles',
        short_name: 'Articles',
        description: 'View the latest digital ethics articles',
        url: '/',
        icons: [
          {
            src: '/logo1.png',
            sizes: '96x96',
          },
        ],
      },
    ],
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'DataÉtica Blog Desktop View',
      },
      {
        src: '/screenshot-mobile.png', 
        sizes: '360x640',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'DataÉtica Blog Mobile View',
      },
    ],
  };
}
