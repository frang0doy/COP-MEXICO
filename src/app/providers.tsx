'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import CountryGateMexico from '@/components/country/CountryPickerModal'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <CountryGateMexico />
      <Toaster position="top-right" />
    </SessionProvider>
  )
}
