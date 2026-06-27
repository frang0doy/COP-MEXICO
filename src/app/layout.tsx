import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import ScrollProgress from '@/components/layout/ScrollProgress'
import WhatsAppFloatingButton from '@/components/layout/WhatsAppFloatingButton'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'COP Recubrimientos México',
    template: '%s | COP Recubrimientos México',
  },
  description: 'COP, líder en materiales de construcción en México. Encuentra pinturas, revestimientos y materiales de alta calidad para profesionales.',
  keywords: 'materiales construcción, pinturas, revestimientos, México, construcción',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const companyWhatsapp = (
    process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || '5492314577877'
  ).trim()

  return (
    <html lang="es" className={inter.variable}>
      <body>
        <Providers>
          <ScrollProgress />
          {children}
          <WhatsAppFloatingButton phone={companyWhatsapp} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4200,
              className:
                'rounded-xl border border-gray-200 bg-white text-gray-900 shadow-xl ring-1 ring-orange-500/10',
              success: {
                className:
                  'rounded-xl border border-green-200 bg-white text-gray-900 shadow-xl ring-1 ring-orange-500/10',
              },
              error: {
                className:
                  'rounded-xl border border-red-200 bg-white text-gray-900 shadow-xl ring-1 ring-orange-500/10',
              },
              loading: {
                className:
                  'rounded-xl border border-orange-200 bg-white text-gray-900 shadow-xl ring-1 ring-orange-500/20',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

