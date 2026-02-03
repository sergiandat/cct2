'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Building2, AlertTriangle, Clock, CheckCircle, MessageSquare } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import empresasData from '@/data/empresas.json'
import {
  formatDate,
  formatPercent,
  calcularCriticidad,
  getNivelCriticidad,
  diasHastaFecha,
  cn
} from '@/lib/utils'
import { ESTADO_COLORS } from '@/lib/constants'

const estadoConfig = {
  vigente: { label: 'Vigente', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  por_vencer: { label: 'Por vencer', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  vencido: { label: 'Vencido', icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
  en_negociacion: { label: 'En negociación', icon: MessageSquare, color: 'bg-blue-100 text-blue-800' },
}

export default function EmpresasPage() {
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null)

  // Calcular criticidad y ordenar
  const empresasConCriticidad = empresasData.map((e) => ({
    ...e,
    criticidad: calcularCriticidad(e as any),
    diasVencimiento: diasHastaFecha(e.vencimiento),
  }))

  // Filtrar
  const empresasFiltradas = empresasConCriticidad.filter((e) => {
    const matchBusqueda = e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.cct.toLowerCase().includes(busqueda.toLowerCase())
    const matchEstado = !filtroEstado || e.estado === filtroEstado
    return matchBusqueda && matchEstado
  })

  // Ordenar por criticidad
  const empresasOrdenadas = [...empresasFiltradas].sort((a, b) => b.criticidad - a.criticidad)

  // Estadísticas
  const stats = {
    total: empresasData.length,
    vigentes: empresasData.filter((e) => e.estado === 'vigente').length,
    porVencer: empresasData.filter((e) => e.estado === 'por_vencer').length,
    vencidos: empresasData.filter((e) => e.estado === 'vencido').length,
    enNegociacion: empresasData.filter((e) => e.estado === 'en_negociacion').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
        <p className="text-gray-500">
          Gestión de convenios colectivos por empresa
        </p>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-5 gap-4">
        <button
          onClick={() => setFiltroEstado(null)}
          className={cn(
            'rounded-lg border p-4 text-left transition-colors',
            !filtroEstado ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          )}
        >
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </button>
        <button
          onClick={() => setFiltroEstado('vigente')}
          className={cn(
            'rounded-lg border p-4 text-left transition-colors',
            filtroEstado === 'vigente' ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
          )}
        >
          <p className="text-2xl font-bold text-green-600">{stats.vigentes}</p>
          <p className="text-sm text-gray-500">Vigentes</p>
        </button>
        <button
          onClick={() => setFiltroEstado('por_vencer')}
          className={cn(
            'rounded-lg border p-4 text-left transition-colors',
            filtroEstado === 'por_vencer' ? 'border-yellow-500 bg-yellow-50' : 'hover:bg-gray-50'
          )}
        >
          <p className="text-2xl font-bold text-yellow-600">{stats.porVencer}</p>
          <p className="text-sm text-gray-500">Por vencer</p>
        </button>
        <button
          onClick={() => setFiltroEstado('vencido')}
          className={cn(
            'rounded-lg border p-4 text-left transition-colors',
            filtroEstado === 'vencido' ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'
          )}
        >
          <p className="text-2xl font-bold text-red-600">{stats.vencidos}</p>
          <p className="text-sm text-gray-500">Vencidos</p>
        </button>
        <button
          onClick={() => setFiltroEstado('en_negociacion')}
          className={cn(
            'rounded-lg border p-4 text-left transition-colors',
            filtroEstado === 'en_negociacion' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          )}
        >
          <p className="text-2xl font-bold text-blue-600">{stats.enNegociacion}</p>
          <p className="text-sm text-gray-500">En negociación</p>
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o CCT..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-lg border pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Lista de empresas */}
      <div className="space-y-3">
        {empresasOrdenadas.map((empresa) => {
          const nivel = getNivelCriticidad(empresa.criticidad)
          const config = estadoConfig[empresa.estado as keyof typeof estadoConfig]
          const Icon = config.icon

          return (
            <Link key={empresa.id} href={`/empresas/${empresa.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    {/* Info principal */}
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-lg',
                        ESTADO_COLORS[nivel].bg
                      )}>
                        <Building2 className={cn('h-6 w-6', ESTADO_COLORS[nivel].text)} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{empresa.nombre}</h3>
                        <p className="text-sm text-gray-500">
                          CCT {empresa.cct} • {empresa.afiliados} afiliados
                        </p>
                      </div>
                    </div>

                    {/* Estado y métricas */}
                    <div className="flex items-center gap-6">
                      {/* Brecha */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Brecha inflación</p>
                        <p className={cn(
                          'font-semibold',
                          empresa.brechaInflacion >= 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {formatPercent(empresa.brechaInflacion)}
                        </p>
                      </div>

                      {/* Vencimiento */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Vencimiento</p>
                        <p className={cn(
                          'font-semibold',
                          empresa.diasVencimiento <= 0 ? 'text-red-600' :
                          empresa.diasVencimiento <= 90 ? 'text-yellow-600' : 'text-gray-900'
                        )}>
                          {formatDate(empresa.vencimiento)}
                        </p>
                      </div>

                      {/* Estado */}
                      <Badge className={config.color}>
                        <Icon className="mr-1 h-3 w-3" />
                        {config.label}
                      </Badge>

                      {/* Indicador criticidad */}
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Criticidad</span>
                          <span className={ESTADO_COLORS[nivel].text}>
                            {Math.round(empresa.criticidad * 100)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200">
                          <div
                            className={cn('h-2 rounded-full', ESTADO_COLORS[nivel].bg)}
                            style={{ width: `${empresa.criticidad * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {empresasOrdenadas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron empresas con los filtros seleccionados
        </div>
      )}
    </div>
  )
}
