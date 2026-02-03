'use client'

import { Search, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { USUARIO_DEMO } from '@/lib/constants'

// Datos de alertas para el badge
import alertasData from '@/data/alertas.json'

export function Header() {
  const { setCommandMenuOpen } = useAppStore()

  const alertasCriticas = alertasData.filter(
    (a) => a.nivel === 'critico' || a.nivel === 'alto'
  ).length

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Search */}
      <button
        onClick={() => setCommandMenuOpen(true)}
        className="flex items-center gap-2 rounded-lg border bg-gray-50 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 transition-colors w-96"
      >
        <Search className="h-4 w-4" />
        <span>Buscar empresa, convenio, cláusula...</span>
        <kbd className="ml-auto rounded bg-gray-200 px-2 py-0.5 text-xs font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {alertasCriticas > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {alertasCriticas}
            </span>
          )}
        </Button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {USUARIO_DEMO.nombre}
            </p>
            <p className="text-xs text-gray-500">{USUARIO_DEMO.gremio}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
            {USUARIO_DEMO.nombre.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  )
}
