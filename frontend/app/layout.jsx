import { Space_Grotesk, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SmoothScroll } from '@/components/providers/smooth-scroll'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { Toaster } from '@/components/ui/sonner'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

const syne = Syne({ 
  subsets: ["latin"],
  variable: '--font-display'
});

export const metadata = {
  title: 'JustBid - Win More Tenders',
  description: 'AI-powered tender discovery and bidding platform. Find, analyze, and win government contracts.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${syne.variable} bg-background`}>
      <body className="font-sans antialiased overflow-x-hidden cursor-none">
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
        <Toaster closeButton position="top-right" expand={false} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
