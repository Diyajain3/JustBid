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
      <body className="font-sans antialiased overflow-x-hidden cursor-none relative">
        {/* Ceiling Glow - Discrete */}
        <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-[100] shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
        
        {/* Background Decorative Elements */}
        <div className="bg-blob blob-gold" />
        <div className="bg-blob blob-deep" />
        <div className="fixed inset-0 bg-dot-pattern pointer-events-none z-0" />
        
        <div className="relative z-10">
          <SmoothScroll>
            <CustomCursor />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </SmoothScroll>
        </div>
        <Toaster closeButton position="top-right" expand={false} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
