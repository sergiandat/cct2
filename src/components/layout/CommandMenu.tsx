'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  Building2,
  GitCompare,
  MessageSquare,
  FileText,
  Search,
  AlertTriangle,
} from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import empresasData from '@/data/empresas.json'
import alertasData from '@/data/alertas.json'
import { PREGUNTAS_SUGERIDAS } from '@/lib/constants'

export function CommandMenu() {
  const router = useRouter()
  const { commandMenuOpen, setCommandMenuOpen } = useAppStore()

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandMenuOpen(!commandMenuOpen)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [commandMenuOpen, setCommandMenuOpen])

  const runCommand = (command: () => void) => {
    setCommandMenuOpen(false)
    command()
  }

  if (!commandMenuOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setCommandMenuOpen(false)}
      />

      {/* Command palette */}
      <div className="fixed left-1/2 top-1/4 w-full max-w-xl -translate-x-1/2 rounded-xl bg-white shadow-2xl">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Buscar empresa, convenio, o hacer una consulta..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              No se encontraron resultados.
            </Command.Empty>

            {/* Alertas críticas */}
            <Command.Group heading="Alertas Críticas">
              {alertasData
                .filter((a) => a.nivel === 'critico')
                .slice(0, 3)
                .map((alerta) => (
                  <Command.Item
                    key={alerta.id}
                    onSelect={() =>
                      runCommand(() => router.push(`/empresas/${alerta.empresaId}`))
                    }
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-red-50 cursor-pointer"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>{alerta.titulo}</span>
                  </Command.Item>
                ))}
            </Command.Group>

            {/* Empresas */}
            <Command.Group heading="Empresas">
              {empresasData.slice(0, 5).map((empresa) => (
                <Command.Item
                  key={empresa.id}
                  onSelect={() =>
                    runCommand(() => router.push(`/empresas/${empresa.id}`))
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>{empresa.nombre}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {empresa.cct}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Acciones rápidas */}
            <Command.Group heading="Acciones Rápidas">
              <Command.Item
                onSelect={() => runCommand(() => router.push('/comparador'))}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                <GitCompare className="h-4 w-4 text-gray-400" />
                <span>Comparar empresas</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/consultas'))}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span>Hacer una consulta</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/clausulas'))}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-gray-400" />
                <span>Ver mapa de cláusulas</span>
              </Command.Item>
            </Command.Group>

            {/* Consultas sugeridas */}
            <Command.Group heading="Consultas Frecuentes">
              {PREGUNTAS_SUGERIDAS.slice(0, 4).map((pregunta, i) => (
                <Command.Item
                  key={i}
                  onSelect={() =>
                    runCommand(() => router.push(`/consultas?q=${encodeURIComponent(pregunta)}`))
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-600">{pregunta}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="border-t px-3 py-2">
            <p className="text-xs text-gray-500">
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">↑↓</kbd>
              {' '}navegar{' '}
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">↵</kbd>
              {' '}seleccionar{' '}
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">esc</kbd>
              {' '}cerrar
            </p>
          </div>
        </Command>
      </div>
    </div>
  )
}
