import { StatsCards } from '@/components/dashboard/StatsCards'
import { DiagnosticoPanel } from '@/components/dashboard/DiagnosticoPanel'
import { AccionesRapidas } from '@/components/dashboard/AccionesRapidas'
import { AlertasRecientes } from '@/components/dashboard/AlertasRecientes'
import { EmpresasTable } from '@/components/dashboard/EmpresasTable'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          Vista general del estado de convenios y negociaciones
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - Diagnóstico */}
        <div className="lg:col-span-2 space-y-6">
          <DiagnosticoPanel />
          <EmpresasTable />
        </div>

        {/* Right column - Acciones y Alertas */}
        <div className="space-y-6">
          <AccionesRapidas />
          <AlertasRecientes />
        </div>
      </div>
    </div>
  )
}
