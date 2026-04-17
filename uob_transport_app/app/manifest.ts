import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'UoB Taxi & Chauffeur',
        short_name: 'UoB Taxi',
        description: 'University of Bristol Taxi and Chauffeur Booking System',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#2c2c2c',
        icons: [
            {
                src: '/windows.png',
                sizes: '256x256',
                type: 'image/png',
            },
            {
                src: '/windows-large.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/android.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}