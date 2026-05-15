// apps/customer-web/app/layout.tsx
import type { Metadata } from 'next'
import { AuthProvider } from '@/features/auth'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Zalldi — Food, Groceries & More',
    template: '%s | Zalldi',
  },
  description: 'Order food, groceries and more — delivered fast to your door.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_CUSTOMER_WEB_URL ?? 'https://zalldi.com'
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}