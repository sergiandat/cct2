'use client'

import { useState } from 'react'
import { Download, Info, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import empresasData from '@/data/empresas.json'
import clausulasData from '@/data/clausulas.json'
import { CLAUSULAS, CATEGORIAS_CLAUSULAS } from '@/lib/constants'
import { cn } from '@/lib/utils'

type ClausulasDataType = typeof clausulasData
type EmpresaId = keyof ClausulasDataType
type EstadoClausula = 'presente' | 'ausente' | 'parcial' | 'mejor' | 'peor'

const estadoConfig: Record<EstadoClausula, { color: string; label: string }> = {
  presente: { color: 'bg-green-500', label: 'Presente' },
  ausente: { color: 'bg-gray-300', label: 'Ausente' },
  parcial: { color: 'bg-yellow-500', label: 'Parcial' },
  mejor: { color: 'bg-green-600', label: 'Mejor' },
  peor: { color: 'bg-red-500', label: 'Peor' },
}

export default function ClausulasPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null)
  const [empresasSeleccionadas, setEmpresasSeleccionadas] = useState<string[]>([
    'transener',
    'transpa',
    'edenor',
    'edesur',
    'cammesa',
  ])

  const clausulasFiltradas = categoriaFiltro
    ? CLAUSULAS.filter((c) => c.categoria === categoriaFiltro)
    : CLAUSULAS

  const getClausulaData = (empresaId: string, clausulaId: string) => {
    const empresaData = clausulasData[empresaId as EmpresaId]
    if (!empresaData) return null
    return empresaData[clausulaId as keyof typeof empresaData] || null
  }

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    let ausentes = 0
    let peores = 0

    empresasSeleccionadas.forEach((empresaId) => {
      CLAUSULAS.forEach((clausula) => {
        const data = getClausulaData(empresaId, clausula.id)
        if (!data || data.estado === 'ausente') ausentes++
        if (data?.estado === 'peor') peores++
      })
    })

    return { ausentes, peores }
  }

  const stats = calcularEstadisticas()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mapa de Cláusulas</h1>
          <p className="text-gray-500">
            Visualización de beneficios y condiciones por empresa
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-900">
            {empresasSeleccionadas.length * CLAUSULAS.length}
          </div>
          <div className="text-sm text-gray-500">Cláusulas analizadas</div>
        </Card>
        <Card className="p-4 border-gray-300 bg-gray-50">
          <div className="text-2xl font-bold text-gray-600">{stats.ausentes}</div>
          <div className="text-sm text-gray-500">Cláusulas ausentes</div>
        </Card>
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="text-2xl font-bold text-red-600">{stats.peores}</div>
          <div className="text-sm text-gray-500">Por debajo del estándar</div>
        </Card>
      </div>

      {/* Filtros por categoría */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCategoriaFiltro(null)}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            categoriaFiltro === null
              ? 'bg-blue-600 text-white'
              : 'bg-white border hover:bg-gray-50'
          )}
        >
          Todas
        </button>
        {CATEGORIAS_CLAUSULAS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaFiltro(cat.id)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              categoriaFiltro === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-white border hover:bg-gray-50'
            )}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Semáforo / Heatmap */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Semáforo de Cláusulas</CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded bg-green-500" />
                <span>Presente</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded bg-green-600" />
                <span>Mejor</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded bg-yellow-500" />
                <span>Parcial</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded bg-red-500" />
                <span>Peor</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded bg-gray-300" />
                <span>Ausente</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-gray-500 min-w-[200px]">
                    Cláusula
                  </th>
                  {empresasSeleccionadas.map((id) => {
                    const empresa = empresasData.find((e) => e.id === id)
                    return (
                      <th
                        key={id}
                        className="pb-3 text-center font-medium text-gray-500 min-w-[100px]"
                      >
                        {empresa?.nombre.split(' ')[0]}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {CATEGORIAS_CLAUSULAS.map((categoria) => {
                  const clausulasCategoria = clausulasFiltradas.filter(
                    (c) => c.categoria === categoria.id
                  )

                  if (clausulasCategoria.length === 0) return null

                  return (
                    <>
                      {/* Header de categoría */}
                      <tr key={categoria.id} className="bg-gray-50">
                        <td
                          colSpan={empresasSeleccionadas.length + 1}
                          className="py-2 px-3 font-semibold text-gray-700"
                        >
                          {categoria.nombre}
                        </td>
                      </tr>

                      {/* Cláusulas de la categoría */}
                      {clausulasCategoria.map((clausula) => (
                        <tr key={clausula.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {clausula.nombre}
                              </span>
                              {clausula.unidad && (
                                <span className="text-xs text-gray-400">
                                  ({clausula.unidad})
                                </span>
                              )}
                            </div>
                          </td>
                          {empresasSeleccionadas.map((empresaId) => {
                            const data = getClausulaData(empresaId, clausula.id)
                            const estado = (data?.estado || 'ausente') as EstadoClausula
                            const config = estadoConfig[estado]

                            return (
                              <td key={empresaId} className="py-3 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <div
                                    className={cn(
                                      'h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-medium',
                                      config.color
                                    )}
                                    title={config.label}
                                  >
                                    {data?.valor !== null && data?.valor !== undefined
                                      ? data.valor
                                      : '-'}
                                  </div>
                                  {data?.articulo && (
                                    <button className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      {data.articulo}
                                    </button>
                                  )}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-700">
            Oportunidades de Mejora Detectadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-gray-500 font-bold">•</span>
              <span>
                <strong>TRANSPA</strong> no tiene adicional por zona ni licencia
                por mudanza. Inequidad respecto a empresas comparables.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500 font-bold">•</span>
              <span>
                <strong>CAMMESA</strong> es la única empresa grande sin adicional
                por título universitario.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500 font-bold">•</span>
              <span>
                La licencia por paternidad varía entre 10 y 15 días.
                <strong> TRANSPA y CAMMESA</strong> están por debajo del promedio.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
