import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rayofi AI Ad Dashboard',
  description: 'Interactive, auto-updating ad performance dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-white/10 sticky top-0 bg-black/20 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Rayofi AI Ad Dashboard</h1>
            <nav className="text-sm opacity-80">
              <a href="/" className="hover:opacity-100 mr-4">Dashboard</a>
              <a href="/help" className="hover:opacity-100">Help</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
