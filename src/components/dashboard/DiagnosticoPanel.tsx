'use client'

import Link from 'next/link'
import { AlertTriangle, TrendingDown, FileX, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import empresasData from '@/data/empresas.json'
import {
  calcularCriticidad,
  getNivelCriticidad,
  formatPercent,
  diasHastaFecha,
  formatDateRelative,
} from '@/lib/utils'

// Calcular criticidad para cada empresa
const empresasConCriticidad = empresasData.map((empresa) => ({
  ...empresa,
  criticidad: calcularCriticidad(empresa as any),
}))

// Ordenar por criticidad y tomar las 3 más críticas
const empresasCriticas = empresasConCriticidad
  .sort((a, b) => b.criticidad - a.criticidad)
  .slice(0, 3)

export function DiagnosticoPanel() {
  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-lg text-red-700">
              Empresas que Requieren Atención
            </CardTitle>
          </div>
          <Badge variant="critico">{empresasCriticas.length} críticas</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {empresasCriticas.map((empresa) => {
          const nivel = getNivelCriticidad(empresa.criticidad)
          const diasVenc = diasHastaFecha(empresa.vencimiento)

          return (
            <div
              key={empresa.id}
              className="rounded-lg border border-red-200 bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">
                      {empresa.nombre}
                    </h4>
                    <Badge variant={nivel}>{nivel.toUpperCase()}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    {/* Vencimiento */}
                    {diasVenc <= 30 && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>
                          {diasVenc <= 0 ? 'Vencido' : `Vence ${formatDateRelative(empresa.vencimiento)}`}
                        </span>
                      </div>
                    )}

                    {/* Brecha */}
                    {empresa.brechaInflacion < -0.05 && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <TrendingDown className="h-4 w-4" />
                        <span>
                          Brecha {formatPercent(empresa.brechaInflacion)} vs inflación
                        </span>
                      </div>
                    )}

                    {/* Cláusulas */}
                    {empresa.clausulasAusentes > 0 && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <FileX className="h-4 w-4" />
                        <span>{empresa.clausulasAusentes} cláusulas ausentes</span>
                      </div>
                    )}
                  </div>
                </div>

                <Link href={`/empresas/${empresa.id}`}>
                  <Button variant="outline" size="sm">
                    Ver detalle
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Barra de criticidad visual */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Nivel de criticidad</span>
                  <span>{Math.round(empresa.criticidad * 100)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full ${
                      nivel === 'critico'
                        ? 'bg-red-500'
                        : nivel === 'alto'
                        ? 'bg-orange-500'
                        : 'bg-yellow-500'
                    }`}
                    style={{ width: `${empresa.criticidad * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}

        <Link href="/empresas?filter=criticas" className="block">
          <Button variant="outline" className="w-full">
            Ver todas las empresas críticas
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
