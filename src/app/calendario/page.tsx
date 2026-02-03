'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  AlertTriangle,
  Clock,
  FileText,
  Users
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import empresasData from '@/data/empresas.json'
import { formatDate, diasHastaFecha, cn } from '@/lib/utils'

// Generar eventos del calendario
const generarEventos = () => {
  const eventos: Array<{
    fecha: Date
    tipo: 'vencimiento' | 'negociacion' | 'reunion' | 'alerta'
    titulo: string
    empresaId?: string
    empresaNombre?: string
    color: string
  }> = []

  // Vencimientos de convenios
  empresasData.forEach((empresa) => {
    const fechaVenc = new Date(empresa.vencimiento)
    eventos.push({
      fecha: fechaVenc,
      tipo: 'vencimiento',
      titulo: `Vencimiento CCT ${empresa.nombre}`,
      empresaId: empresa.id,
      empresaNombre: empresa.nombre,
      color: diasHastaFecha(empresa.vencimiento) <= 30 ? 'bg-red-500' : 'bg-yellow-500',
    })
  })

  // Reuniones simuladas (próximos 60 días)
  const hoy = new Date()
  const reuniones = [
    { dias: 5, titulo: 'Reunión paritaria TRANSPA', empresaId: 'transpa' },
    { dias: 12, titulo: 'Mesa técnica EDENOR', empresaId: 'edenor' },
    { dias: 18, titulo: 'Negociación EDEN', empresaId: 'eden' },
    { dias: 25, titulo: 'Seguimiento CAMMESA', empresaId: 'cammesa' },
    { dias: 35, titulo: 'Revisión anual EDESUR', empresaId: 'edesur' },
  ]

  reuniones.forEach((reunion) => {
    const fecha = new Date(hoy)
    fecha.setDate(fecha.getDate() + reunion.dias)
    const empresa = empresasData.find((e) => e.id === reunion.empresaId)
    eventos.push({
      fecha,
      tipo: 'reunion',
      titulo: reunion.titulo,
      empresaId: reunion.empresaId,
      empresaNombre: empresa?.nombre,
      color: 'bg-blue-500',
    })
  })

  return eventos
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function CalendarioPage() {
  const [mesActual, setMesActual] = useState(new Date())
  const eventos = useMemo(() => generarEventos(), [])

  // Obtener días del mes
  const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1)
  const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0)
  const diasEnMes = ultimoDia.getDate()
  const primerDiaSemana = primerDia.getDay()

  // Generar array de días
  const dias = []
  for (let i = 0; i < primerDiaSemana; i++) {
    dias.push(null)
  }
  for (let i = 1; i <= diasEnMes; i++) {
    dias.push(i)
  }

  // Función para obtener eventos de un día
  const getEventosDia = (dia: number) => {
    return eventos.filter((e) => {
      return (
        e.fecha.getFullYear() === mesActual.getFullYear() &&
        e.fecha.getMonth() === mesActual.getMonth() &&
        e.fecha.getDate() === dia
      )
    })
  }

  // Eventos del mes
  const eventosDelMes = eventos
    .filter((e) => {
      return (
        e.fecha.getFullYear() === mesActual.getFullYear() &&
        e.fecha.getMonth() === mesActual.getMonth()
      )
    })
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())

  // Próximos eventos (próximos 30 días)
  const hoy = new Date()
  const en30Dias = new Date(hoy)
  en30Dias.setDate(en30Dias.getDate() + 30)

  const proximosEventos = eventos
    .filter((e) => e.fecha >= hoy && e.fecha <= en30Dias)
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
    .slice(0, 8)

  const mesAnterior = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1))
  }

  const mesSiguiente = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1))
  }

  const irAHoy = () => {
    setMesActual(new Date())
  }

  const esHoy = (dia: number) => {
    const hoy = new Date()
    return (
      dia === hoy.getDate() &&
      mesActual.getMonth() === hoy.getMonth() &&
      mesActual.getFullYear() === hoy.getFullYear()
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <p className="text-gray-500">
            Vencimientos, reuniones y eventos de negociación
          </p>
        </div>
        <Button onClick={irAHoy}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Hoy
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendario */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {MESES[mesActual.getMonth()]} {mesActual.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={mesAnterior}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={mesSiguiente}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DIAS_SEMANA.map((dia) => (
                <div
                  key={dia}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {dia}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-1">
              {dias.map((dia, index) => {
                if (dia === null) {
                  return <div key={`empty-${index}`} className="h-24" />
                }

                const eventosDia = getEventosDia(dia)
                const tieneEventos = eventosDia.length > 0

                return (
                  <div
                    key={dia}
                    className={cn(
                      'h-24 rounded-lg border p-1 transition-colors',
                      esHoy(dia) && 'border-blue-500 bg-blue-50',
                      tieneEventos && !esHoy(dia) && 'bg-gray-50'
                    )}
                  >
                    <div className={cn(
                      'text-sm font-medium mb-1',
                      esHoy(dia) && 'text-blue-600'
                    )}>
                      {dia}
                    </div>
                    <div className="space-y-1">
                      {eventosDia.slice(0, 2).map((evento, i) => (
                        <div
                          key={i}
                          className={cn(
                            'text-xs px-1 py-0.5 rounded truncate text-white',
                            evento.color
                          )}
                          title={evento.titulo}
                        >
                          {evento.titulo.length > 15
                            ? evento.titulo.substring(0, 15) + '...'
                            : evento.titulo}
                        </div>
                      ))}
                      {eventosDia.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{eventosDia.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Próximos eventos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Próximos 30 días
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proximosEventos.map((evento, i) => {
                  const IconoTipo = evento.tipo === 'vencimiento' ? AlertTriangle :
                    evento.tipo === 'reunion' ? Users : FileText

                  return (
                    <Link
                      key={i}
                      href={evento.empresaId ? `/empresas/${evento.empresaId}` : '#'}
                    >
                      <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg',
                          evento.tipo === 'vencimiento' ? 'bg-red-100' : 'bg-blue-100'
                        )}>
                          <IconoTipo className={cn(
                            'h-4 w-4',
                            evento.tipo === 'vencimiento' ? 'text-red-600' : 'text-blue-600'
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {evento.titulo}
                          </p>
                          <p className="text-xs text-gray-500">
                            {evento.fecha.toLocaleDateString('es-AR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            evento.tipo === 'vencimiento' && 'border-red-200 text-red-700',
                            evento.tipo === 'reunion' && 'border-blue-200 text-blue-700'
                          )}
                        >
                          {evento.tipo === 'vencimiento' ? 'Venc.' : 'Reunión'}
                        </Badge>
                      </div>
                    </Link>
                  )
                })}

                {proximosEventos.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay eventos próximos
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Leyenda */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">Leyenda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Vencimiento urgente (&lt;30 días)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Vencimiento próximo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Reunión/Negociación</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eventos del mes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Eventos de {MESES[mesActual.getMonth()]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventosDelMes.length > 0 ? (
                <div className="space-y-2">
                  {eventosDelMes.map((evento, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{evento.titulo}</span>
                      <span className="text-gray-400">
                        {evento.fecha.getDate()}/{evento.fecha.getMonth() + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay eventos este mes
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
