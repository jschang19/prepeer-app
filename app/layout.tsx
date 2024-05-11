import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'


import { GoogleAnalytics } from '@next/third-parties/google'
import PrepeerConfig from '@/prepeer.config';

export const metadata = {
  metadataBase: process.env.AUTH_URL
    ? new URL(`${process.env.AUTH_URL}`)
    : undefined,
  title: {
    default: 'Prepeer 面試練習器 - 讓 AI 幫你準備大學面試',
    template: `%s - Prepeer 面試練習器`
  },
  description: '用 AI 幫你準備大學校系的二階面試準備',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    title: 'Prepeer 面試練習器 - 讓 AI 幫你準備大學面試',
    description: '用 AI 幫你準備大學校系的二階面試準備',
    url: 'https://prepeer.app',
    siteName: 'Prepeer',
    images: [
      {
        url: 'https://prepeer.app/opengraph-image.png', // Must be an absolute URL
        width: 1686,
        height: 882,
      },
    ],
    locale: 'zh_TW',
    type: 'website',
  }
  
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <Toaster position="top-center" />
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-col h-full flex-1bg-white dark:bg-zinc-900">{children}</main>
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
      <GoogleAnalytics gaId={PrepeerConfig.gaID} />
    </html>
  )
}
