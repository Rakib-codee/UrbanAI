import './globals.css'
import type { Metadata, Viewport } from 'next'
import Providers from './providers'
import { UrbanProvider } from '@/components/UrbanContext'

// Font loading removed to fix build issues
const interClassName = 'font-sans';

export const metadata: Metadata = {
  title: 'UrbanAI - Smart City Planning Assistant',
  description: 'AI-powered urban planning and smart city development assistant',
  applicationName: 'UrbanAI',
  authors: [{ name: 'UrbanAI Team' }],
  keywords: ['smart city', 'urban planning', 'AI', 'sustainability', 'traffic management', 'resource optimization'],
  creator: 'UrbanAI',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interClassName}`}>
        <UrbanProvider>
          <Providers>
            <div className="root-container">
              {children}
            </div>
          </Providers>
        </UrbanProvider>
      </body>
    </html>
  );
} 