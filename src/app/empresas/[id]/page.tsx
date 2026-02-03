'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calculator,
  Download,
  Play,
  RotateCcw,
  ExternalLink
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import empresasData from '@/data/empresas.json'
import escalasData from '@/data/escalas.json'
import clausulasData from '@/data/clausulas.json'
import {
  formatMoney,
  formatPercent,
  formatDate,
  formatDateRelative,
  calcularCriticidad,
  getNivelCriticidad,
  diasHastaFecha,
  cn
} from '@/lib/utils'
import { ESTADO_COLORS, CATEGORIAS_APUAYE, CLAUSULAS } from '@/lib/constants'

type EscalasDataType = typeof escalasData
type EmpresaId = keyof EscalasDataType

type ClausulasDataType = typeof clausulasData
type ClausulaEmpresaId = keyof ClausulasDataType

const estadoConfig = {
  vigente: { label: 'Vigente', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  por_vencer: { label: 'Por vencer', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  vencido: { label: 'Vencido', icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
  en_negociacion: { label: 'En negociación', icon: FileText, color: 'bg-blue-100 text-blue-800' },
}

export default function EmpresaDetallePage() {
  const params = useParams()
  const router = useRouter()
  const empresaId = params.id as string

  // Encontrar empresa
  const empresa = empresasData.find((e) => e.id === empresaId)
  const escala = escalasData[empresaId as EmpresaId]
  const clausulasEmpresa = clausulasData[empresaId as ClausulaEmpresaId]

  // Estados del simulador
  const [aumentoBase, setAumentoBase] = useState(15)
  const [sumaFija, setSumaFija] = useState(0)
  const [aumentoZona, setAumentoZona] = useState(0)
  const [categoriaSimulada, setCategoriaSimulada] = useState('U-III')

  if (!empresa) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500 mb-4">Empresa no encontrada</p>
        <Button onClick={() => router.push('/empresas')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a empresas
        </Button>
      </div>
    )
  }

  const criticidad = calcularCriticidad(empresa as any)
  const nivelCriticidad = getNivelCriticidad(criticidad)
  const diasVenc = diasHastaFecha(empresa.vencimiento)
  const config = estadoConfig[empresa.estado as keyof typeof estadoConfig]
  const Icon = config.icon

  // Obtener nivel actual para simulación
  const nivelActual = escala?.niveles.find((n) => n.categoria === categoriaSimulada)

  // Calcular proyección
  const proyeccion = useMemo(() => {
    if (!nivelActual) return null

    const nuevoBasico = nivelActual.basico * (1 + aumentoBase / 100) + sumaFija
    const nuevaZona = nivelActual.zona * (1 + aumentoZona / 100)
    const nuevoTotal = nuevoBasico + nuevaZona + nivelActual.antiguedad + nivelActual.titulo

    const totalActual = nivelActual.basico + nivelActual.zona + nivelActual.antiguedad + nivelActual.titulo
    const aumentoReal = (nuevoTotal - totalActual) / totalActual

    return {
      basico: nuevoBasico,
      zona: nuevaZona,
      antiguedad: nivelActual.antiguedad,
      titulo: nivelActual.titulo,
      total: nuevoTotal,
      aumentoReal,
      diferencia: nuevoTotal - totalActual,
    }
  }, [nivelActual, aumentoBase, sumaFija, aumentoZona])

  // Contar cláusulas por estado
  const clausulaStats = useMemo(() => {
    if (!clausulasEmpresa) return { presente: 0, ausente: 0, parcial: 0, mejor: 0, peor: 0 }

    const stats = { presente: 0, ausente: 0, parcial: 0, mejor: 0, peor: 0 }
    Object.values(clausulasEmpresa).forEach((clausula) => {
      const estado = clausula.estado
      if (estado in stats) {
        stats[estado as keyof typeof stats]++
      }
    })
    return stats
  }, [clausulasEmpresa])

  const resetSimulador = () => {
    setAumentoBase(15)
    setSumaFija(0)
    setAumentoZona(0)
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/empresas')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="h-6 w-px bg-gray-200" />
        <nav className="text-sm text-gray-500">
          <Link href="/empresas" className="hover:text-gray-900">Empresas</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{empresa.nombre}</span>
        </nav>
      </div>

      {/* Info principal */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={cn(
            'flex h-16 w-16 items-center justify-center rounded-xl',
            ESTADO_COLORS[nivelCriticidad].bg
          )}>
            <Building2 className={cn('h-8 w-8', ESTADO_COLORS[nivelCriticidad].text)} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{empresa.nombre}</h1>
            <p className="text-gray-500">
              CUIT: {empresa.cuit} • CCT {empresa.cct}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={config.color}>
                <Icon className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
              <Badge variant="outline">
                {empresa.afiliados} afiliados
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/comparador?empresas=${empresa.id}`}>
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Comparar
            </Button>
          </Link>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar informe
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Vencimiento</p>
                <p className={cn(
                  'text-lg font-semibold',
                  diasVenc <= 0 ? 'text-red-600' :
                  diasVenc <= 90 ? 'text-yellow-600' : 'text-gray-900'
                )}>
                  {formatDate(empresa.vencimiento)}
                </p>
                <p className="text-xs text-gray-500">{formatDateRelative(empresa.vencimiento)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {empresa.brechaInflacion >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className="text-sm text-gray-500">Brecha inflación</p>
                <p className={cn(
                  'text-lg font-semibold',
                  empresa.brechaInflacion >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercent(empresa.brechaInflacion)}
                </p>
                <p className="text-xs text-gray-500">vs. IPC acumulado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {empresa.brechaSector >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className="text-sm text-gray-500">Brecha sector</p>
                <p className={cn(
                  'text-lg font-semibold',
                  empresa.brechaSector >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercent(empresa.brechaSector)}
                </p>
                <p className="text-xs text-gray-500">vs. promedio sector</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className={cn(
                'h-8 w-8',
                empresa.clausulasAusentes === 0 ? 'text-green-500' :
                empresa.clausulasAusentes <= 2 ? 'text-yellow-500' : 'text-red-500'
              )} />
              <div>
                <p className="text-sm text-gray-500">Cláusulas ausentes</p>
                <p className="text-lg font-semibold">
                  {empresa.clausulasAusentes} de 18
                </p>
                <p className="text-xs text-gray-500">
                  <Link href={`/clausulas?empresa=${empresa.id}`} className="text-blue-600 hover:underline">
                    Ver detalle
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Escala salarial actual */}
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Escala Salarial Actual</CardTitle>
          </CardHeader>
          <CardContent>
            {escala ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Vigente desde: {formatDate(escala.vigente)}
                </p>
                <div className="space-y-2">
                  {escala.niveles.map((nivel) => {
                    const total = nivel.basico + nivel.zona + nivel.antiguedad + nivel.titulo
                    return (
                      <div
                        key={nivel.categoria}
                        className={cn(
                          'flex items-center justify-between rounded-lg border p-3',
                          categoriaSimulada === nivel.categoria && 'border-blue-500 bg-blue-50'
                        )}
                      >
                        <div>
                          <span className="font-medium">{nivel.categoria}</span>
                          <p className="text-xs text-gray-500">
                            {CATEGORIAS_APUAYE.find((c) => c.codigo === nivel.categoria)?.nombre}
                          </p>
                        </div>
                        <span className="font-semibold">{formatMoney(total)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay escala salarial cargada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Simulador de paritaria */}
        <Card className="col-span-2 border-blue-200">
          <CardHeader className="pb-3 bg-blue-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Simulador de Paritaria
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetSimulador}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Resetear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {escala && nivelActual ? (
              <div className="grid grid-cols-2 gap-6">
                {/* Controles */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría a simular
                    </label>
                    <select
                      value={categoriaSimulada}
                      onChange={(e) => setCategoriaSimulada(e.target.value)}
                      className="w-full rounded-lg border px-3 py-2"
                    >
                      {CATEGORIAS_APUAYE.map((cat) => (
                        <option key={cat.codigo} value={cat.codigo}>
                          {cat.codigo} - {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aumento sobre básico: {aumentoBase}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={aumentoBase}
                      onChange={(e) => setAumentoBase(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suma fija: {formatMoney(sumaFija)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="10000"
                      value={sumaFija}
                      onChange={(e) => setSumaFija(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$0</span>
                      <span>$100K</span>
                      <span>$200K</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aumento zona: {aumentoZona}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={aumentoZona}
                      onChange={(e) => setAumentoZona(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>15%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>

                {/* Resultado */}
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Comparación</h4>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="text-left pb-2">Concepto</th>
                          <th className="text-right pb-2">Actual</th>
                          <th className="text-right pb-2">Proyectado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-2">Básico</td>
                          <td className="py-2 text-right">{formatMoney(nivelActual.basico)}</td>
                          <td className="py-2 text-right font-medium text-blue-600">
                            {proyeccion && formatMoney(proyeccion.basico)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">Zona</td>
                          <td className="py-2 text-right">{formatMoney(nivelActual.zona)}</td>
                          <td className="py-2 text-right font-medium text-blue-600">
                            {proyeccion && formatMoney(proyeccion.zona)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">Antigüedad</td>
                          <td className="py-2 text-right">{formatMoney(nivelActual.antiguedad)}</td>
                          <td className="py-2 text-right">{formatMoney(nivelActual.antiguedad)}</td>
                        </tr>
                        <tr>
                          <td className="py-2">Título</td>
                          <td className="py-2 text-right">{formatMoney(nivelActual.titulo)}</td>
                          <td className="py-2 text-right">{formatMoney(nivelActual.titulo)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Resumen */}
                  <div className="rounded-lg bg-blue-600 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-100">Total actual</span>
                      <span className="text-lg">
                        {formatMoney(nivelActual.basico + nivelActual.zona + nivelActual.antiguedad + nivelActual.titulo)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-100">Total proyectado</span>
                      <span className="text-2xl font-bold">
                        {proyeccion && formatMoney(proyeccion.total)}
                      </span>
                    </div>
                    <div className="border-t border-blue-500 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-100">Aumento real</span>
                        <span className="text-xl font-semibold">
                          {proyeccion && formatPercent(proyeccion.aumentoReal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-200">Diferencia mensual</span>
                        <span className="text-blue-100">
                          {proyeccion && formatMoney(proyeccion.diferencia)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar escenario
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay escala salarial para simular
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen de cláusulas */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Resumen de Cláusulas</CardTitle>
            <Link href={`/clausulas?empresa=${empresa.id}`}>
              <Button variant="outline" size="sm">
                Ver semáforo completo
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-500" />
              <span className="text-sm">Presentes: {clausulaStats.presente}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500" />
              <span className="text-sm">Ausentes: {clausulaStats.ausente}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-yellow-500" />
              <span className="text-sm">Parciales: {clausulaStats.parcial}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-blue-500" />
              <span className="text-sm">Mejor que referencia: {clausulaStats.mejor}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-orange-500" />
              <span className="text-sm">Peor que referencia: {clausulaStats.peor}</span>
            </div>
          </div>

          {/* Cláusulas problemáticas */}
          {clausulasEmpresa && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Cláusulas a revisar:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(clausulasEmpresa)
                  .filter(([_, clausulaData]) => clausulaData.estado === 'ausente' || clausulaData.estado === 'peor')
                  .map(([clausulaId, clausulaData]) => {
                    const clausula = CLAUSULAS.find((c) => c.id === clausulaId)
                    return (
                      <Badge
                        key={clausulaId}
                        className={clausulaData.estado === 'ausente' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}
                      >
                        {clausula?.nombre || clausulaId}
                      </Badge>
                    )
                  })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de acuerdos (simulado) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Historial de Acuerdos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-6">
              <div className="relative pl-10">
                <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium">{formatDate(empresa.ultimoAcuerdo)}</p>
                  <p className="text-sm text-gray-500">Último acuerdo salarial</p>
                </div>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-gray-300" />
                <div>
                  <p className="font-medium text-gray-500">Marzo 2024</p>
                  <p className="text-sm text-gray-500">Acuerdo paritario anual (+85%)</p>
                </div>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-gray-300" />
                <div>
                  <p className="font-medium text-gray-500">Octubre 2023</p>
                  <p className="text-sm text-gray-500">Revisión semestral (+45%)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
