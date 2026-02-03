'use client'

import { useState } from 'react'
import { Info, Download, Plus, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import empresasData from '@/data/empresas.json'
import escalasData from '@/data/escalas.json'
import { formatMoney, formatPercent, cn } from '@/lib/utils'
import { CATEGORIAS_APUAYE } from '@/lib/constants'

type EscalasDataType = typeof escalasData
type EmpresaId = keyof EscalasDataType

export default function ComparadorPage() {
  const [empresasSeleccionadas, setEmpresasSeleccionadas] = useState<string[]>([
    'transener',
    'transpa',
    'edenor',
  ])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('U-III')

  const empresasDisponibles = empresasData.filter(
    (e) => !empresasSeleccionadas.includes(e.id)
  )

  const addEmpresa = (id: string) => {
    if (empresasSeleccionadas.length < 5) {
      setEmpresasSeleccionadas([...empresasSeleccionadas, id])
    }
  }

  const removeEmpresa = (id: string) => {
    setEmpresasSeleccionadas(empresasSeleccionadas.filter((e) => e !== id))
  }

  // Obtener datos para la categoría seleccionada
  const datosComparacion = empresasSeleccionadas.map((empresaId) => {
    const escala = escalasData[empresaId as EmpresaId]
    const nivel = escala?.niveles.find((n) => n.categoria === categoriaSeleccionada)
    const empresa = empresasData.find((e) => e.id === empresaId)

    return {
      empresaId,
      nombre: empresa?.nombre || empresaId,
      basico: nivel?.basico || 0,
      zona: nivel?.zona || 0,
      antiguedad: nivel?.antiguedad || 0,
      titulo: nivel?.titulo || 0,
      total: (nivel?.basico || 0) + (nivel?.zona || 0) + (nivel?.antiguedad || 0) + (nivel?.titulo || 0),
    }
  })

  // Calcular promedio para comparación
  const promedioTotal =
    datosComparacion.reduce((sum, d) => sum + d.total, 0) / datosComparacion.length

  // Determinar equivalencias
  const getEquivalencia = (empresaId: string) => {
    // Lógica simplificada de equivalencia
    const mismoCCT = empresasData
      .filter((e) => empresasSeleccionadas.includes(e.id))
      .map((e) => e.cct)

    const empresa = empresasData.find((e) => e.id === empresaId)
    const cctCount = mismoCCT.filter((c) => c === empresa?.cct).length

    if (cctCount > 1) return { tipo: 'directa', label: 'Equivalencia directa', color: 'bg-green-100 text-green-800' }
    return { tipo: 'aproximada', label: 'Equivalencia aproximada', color: 'bg-yellow-100 text-yellow-800' }
  }

  const getColorBrecha = (valor: number, promedio: number) => {
    const diff = (valor - promedio) / promedio
    if (diff >= 0.05) return 'bg-green-500 text-white'
    if (diff >= -0.05) return 'bg-yellow-500 text-black'
    return 'bg-red-500 text-white'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comparador de Empresas</h1>
          <p className="text-gray-500">
            Compará salarios, adicionales y condiciones entre empresas
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Selector de empresas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Empresas a comparar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {empresasSeleccionadas.map((id) => {
              const empresa = empresasData.find((e) => e.id === id)
              const equiv = getEquivalencia(id)

              return (
                <div
                  key={id}
                  className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2"
                >
                  <span className="font-medium">{empresa?.nombre}</span>
                  <Badge className={equiv.color} variant="outline">
                    {equiv.tipo === 'directa' ? '=' : '≈'}
                  </Badge>
                  <button
                    onClick={() => removeEmpresa(id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            })}

            {empresasSeleccionadas.length < 5 && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addEmpresa(e.target.value)
                    e.target.value = ''
                  }
                }}
                className="rounded-lg border px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="">+ Agregar empresa</option>
                {empresasDisponibles.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Leyenda de equivalencias */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <Info className="h-4 w-4" />
            <span>
              <Badge className="bg-green-100 text-green-800 mr-1">=</Badge>
              Mismo CCT base (comparación directa)
            </span>
            <span>
              <Badge className="bg-yellow-100 text-yellow-800 mr-1">≈</Badge>
              Distinto CCT (comparación aproximada)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Selector de categoría */}
      <div className="flex gap-2">
        {CATEGORIAS_APUAYE.map((cat) => (
          <button
            key={cat.codigo}
            onClick={() => setCategoriaSeleccionada(cat.codigo)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              categoriaSeleccionada === cat.codigo
                ? 'bg-blue-600 text-white'
                : 'bg-white border hover:bg-gray-50'
            )}
          >
            {cat.codigo}
          </button>
        ))}
      </div>

      {/* Tabla de comparación */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Comparación Salarial - {categoriaSeleccionada}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-gray-500">
                    Concepto
                  </th>
                  {datosComparacion.map((d) => (
                    <th key={d.empresaId} className="pb-3 text-right font-medium text-gray-500">
                      {d.nombre.split(' ')[0]}
                    </th>
                  ))}
                  <th className="pb-3 text-right font-medium text-gray-500">
                    Diferencia
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 font-medium">Salario Básico</td>
                  {datosComparacion.map((d) => (
                    <td key={d.empresaId} className="py-3 text-right">
                      {formatMoney(d.basico)}
                    </td>
                  ))}
                  <td className="py-3 text-right">
                    <span className="text-sm text-gray-500">-</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">Adicional Zona</td>
                  {datosComparacion.map((d) => (
                    <td key={d.empresaId} className="py-3 text-right">
                      {d.zona > 0 ? (
                        formatMoney(d.zona)
                      ) : (
                        <span className="text-red-500">No tiene</span>
                      )}
                    </td>
                  ))}
                  <td className="py-3 text-right">
                    <span className="text-sm text-gray-500">-</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">Antigüedad</td>
                  {datosComparacion.map((d) => (
                    <td key={d.empresaId} className="py-3 text-right">
                      {formatMoney(d.antiguedad)}
                    </td>
                  ))}
                  <td className="py-3 text-right">
                    <span className="text-sm text-gray-500">-</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium">Adicional Título</td>
                  {datosComparacion.map((d) => (
                    <td key={d.empresaId} className="py-3 text-right">
                      {d.titulo > 0 ? (
                        formatMoney(d.titulo)
                      ) : (
                        <span className="text-red-500">No tiene</span>
                      )}
                    </td>
                  ))}
                  <td className="py-3 text-right">
                    <span className="text-sm text-gray-500">-</span>
                  </td>
                </tr>
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3">TOTAL</td>
                  {datosComparacion.map((d) => {
                    const diff = (d.total - promedioTotal) / promedioTotal
                    return (
                      <td key={d.empresaId} className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{formatMoney(d.total)}</span>
                          <Badge className={getColorBrecha(d.total, promedioTotal)}>
                            {formatPercent(diff)}
                          </Badge>
                        </div>
                      </td>
                    )
                  })}
                  <td className="py-3 text-right">
                    <span className="text-sm text-gray-500">
                      Prom: {formatMoney(promedioTotal)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights automáticos */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-700">
            Insights Automáticos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {datosComparacion.some((d) => d.zona === 0) && (
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>
                    {datosComparacion.filter((d) => d.zona === 0).map((d) => d.nombre.split(' ')[0]).join(', ')}
                  </strong>{' '}
                  no tiene adicional por zona, generando una inequidad significativa.
                </span>
              </li>
            )}
            {datosComparacion.some((d) => d.titulo === 0) && (
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>
                  <strong>
                    {datosComparacion.filter((d) => d.titulo === 0).map((d) => d.nombre.split(' ')[0]).join(', ')}
                  </strong>{' '}
                  no reconoce adicional por título universitario.
                </span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>
                La brecha entre el mejor y peor pagador es de{' '}
                <strong>
                  {formatMoney(Math.max(...datosComparacion.map((d) => d.total)) - Math.min(...datosComparacion.map((d) => d.total)))}
                </strong>{' '}
                mensuales ({formatPercent((Math.max(...datosComparacion.map((d) => d.total)) - Math.min(...datosComparacion.map((d) => d.total))) / Math.min(...datosComparacion.map((d) => d.total)))}).
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
