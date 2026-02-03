'use client'

import Link from 'next/link'
import { MessageSquare, GitCompare, FileCheck, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const acciones = [
  {
    label: 'Consultar convenios',
    description: 'Preguntá sobre cláusulas, salarios o condiciones',
    icon: MessageSquare,
    href: '/consultas',
    color: 'bg-blue-500',
    bgLight: 'bg-blue-50',
  },
  {
    label: 'Comparar empresas',
    description: 'Detectá inequidades entre empresas',
    icon: GitCompare,
    href: '/comparador',
    color: 'bg-purple-500',
    bgLight: 'bg-purple-50',
  },
  {
    label: 'Ver cláusulas',
    description: 'Mapa visual de beneficios por empresa',
    icon: FileCheck,
    href: '/clausulas',
    color: 'bg-green-500',
    bgLight: 'bg-green-50',
  },
  {
    label: 'Calendario',
    description: 'Vencimientos y reuniones programadas',
    icon: Calendar,
    href: '/calendario',
    color: 'bg-orange-500',
    bgLight: 'bg-orange-50',
  },
]

export function AccionesRapidas() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {acciones.map((accion) => (
            <Link
              key={accion.label}
              href={accion.href}
              className={`flex items-center gap-3 rounded-lg border p-4 transition-colors hover:border-gray-300 hover:bg-gray-50`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accion.bgLight}`}>
                <accion.icon className={`h-5 w-5 ${accion.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">{accion.label}</p>
                <p className="text-xs text-gray-500">{accion.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
