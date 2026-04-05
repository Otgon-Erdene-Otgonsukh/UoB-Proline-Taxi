import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'UoB Taxi & Chauffeur',
        short_name: 'UoB Taxi',
        description: 'University of Bristol Taxi and Chauffeur Booking System',
        start_url: '/',
        display: 'standalone',
        icons: [
            {
                src: '/weelv1.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/weelhv1.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/weelv1.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}