'use client'

import { Building2, Clock, AlertTriangle, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import empresasData from '@/data/empresas.json'
import alertasData from '@/data/alertas.json'

export function StatsCards() {
  const totalEmpresas = empresasData.length
  const porVencer = empresasData.filter(e => e.estado === 'por_vencer' || e.estado === 'vencido').length
  const enNegociacion = empresasData.filter(e => e.estado === 'en_negociacion').length
  const alertasCriticas = alertasData.filter(a => a.nivel === 'critico' || a.nivel === 'alto').length

  const stats = [
    {
      label: 'Empresas Activas',
      value: totalEmpresas,
      icon: Building2,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
    },
    {
      label: 'Por Vencer',
      value: porVencer,
      icon: Clock,
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
    },
    {
      label: 'En Negociación',
      value: enNegociacion,
      icon: MessageSquare,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
    },
    {
      label: 'Alertas Críticas',
      value: alertasCriticas,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgLight}`}>
              <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
