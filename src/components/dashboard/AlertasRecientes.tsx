'use client'

import Link from 'next/link'
import { AlertTriangle, Clock, FileX, MessageSquare, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import alertasData from '@/data/alertas.json'
import type { NivelCriticidad } from '@/lib/types'

const iconByTipo = {
  vencimiento: Clock,
  brecha: AlertTriangle,
  clausula: FileX,
  negociacion: MessageSquare,
}

const colorByNivel: Record<NivelCriticidad, string> = {
  critico: 'border-l-red-500 bg-red-50/50',
  alto: 'border-l-orange-500 bg-orange-50/50',
  medio: 'border-l-yellow-500 bg-yellow-50/50',
  bajo: 'border-l-green-500 bg-green-50/50',
}

export function AlertasRecientes() {
  // Ordenar por nivel de criticidad
  const alertasOrdenadas = [...alertasData].sort((a, b) => {
    const orden = { critico: 0, alto: 1, medio: 2, bajo: 3 }
    return orden[a.nivel as NivelCriticidad] - orden[b.nivel as NivelCriticidad]
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Alertas por Criticidad</CardTitle>
          <Badge variant="outline">{alertasData.length} alertas</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alertasOrdenadas.slice(0, 5).map((alerta) => {
          const Icon = iconByTipo[alerta.tipo as keyof typeof iconByTipo]

          return (
            <div
              key={alerta.id}
              className={`rounded-lg border-l-4 p-3 ${colorByNivel[alerta.nivel as NivelCriticidad]}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">
                      {alerta.titulo}
                    </p>
                    <Badge variant={alerta.nivel as any} className="shrink-0">
                      {alerta.nivel}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {alerta.descripcion}
                  </p>
                  {alerta.accionSugerida && (
                    <p className="text-xs text-blue-600 mt-1">
                      Sugerido: {alerta.accionSugerida}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <Link href="/alertas" className="block">
          <Button variant="ghost" className="w-full">
            Ver todas las alertas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
