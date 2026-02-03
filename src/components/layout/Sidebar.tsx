'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  GitCompare,
  FileCheck,
  MessageSquare,
  CalendarDays,
  Settings,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'empresas', label: 'Empresas', icon: Building2, href: '/empresas' },
  { id: 'comparador', label: 'Comparador', icon: GitCompare, href: '/comparador' },
  { id: 'clausulas', label: 'Cláusulas', icon: FileCheck, href: '/clausulas' },
  { id: 'consultas', label: 'Consultas', icon: MessageSquare, href: '/consultas' },
  { id: 'calendario', label: 'Calendario', icon: CalendarDays, href: '/calendario' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              G
            </div>
            <span className="font-semibold text-gray-900">APUAYE</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(!sidebarOpen && 'mx-auto')}
        >
          <ChevronLeft
            className={cn(
              'h-5 w-5 transition-transform',
              !sidebarOpen && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                !sidebarOpen && 'justify-center'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-2">
        <Link
          href="/configuracion"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors',
            !sidebarOpen && 'justify-center'
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span>Configuración</span>}
        </Link>
      </div>
    </aside>
  )
}
