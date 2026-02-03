import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { CommandMenu } from '@/components/layout/CommandMenu'

export const metadata: Metadata = {
  title: 'Sistema Gremial - APUAYE',
  description: 'Plataforma de gestión de convenios colectivos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
        <CommandMenu />
      </body>
    </html>
  )
}
