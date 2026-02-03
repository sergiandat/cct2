'use client'

import Link from 'next/link'
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import empresasData from '@/data/empresas.json'
import {
  formatDateRelative,
  formatPercent,
  diasHastaFecha,
  getEstadoLabel,
} from '@/lib/utils'
import type { EstadoConvenio } from '@/lib/types'

export function EmpresasTable() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Empresas</CardTitle>
          <Link href="/empresas">
            <Button variant="outline" size="sm">
              Ver todas
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">Empresa</th>
                <th className="pb-3 font-medium">CCT</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Vencimiento</th>
                <th className="pb-3 font-medium">Brecha</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {empresasData.slice(0, 8).map((empresa) => {
                const diasVenc = diasHastaFecha(empresa.vencimiento)
                const brechaPositiva = empresa.brechaInflacion >= 0

                return (
                  <tr key={empresa.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {empresa.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          {empresa.afiliados} afiliados
                        </p>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {empresa.cct}
                    </td>
                    <td className="py-3">
                      <Badge variant={empresa.estado as EstadoConvenio}>
                        {getEstadoLabel(empresa.estado as EstadoConvenio)}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-sm ${
                          diasVenc <= 30
                            ? 'text-red-600 font-medium'
                            : diasVenc <= 90
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {formatDateRelative(empresa.vencimiento)}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {brechaPositiva ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            brechaPositiva ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {formatPercent(empresa.brechaInflacion)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Link href={`/empresas/${empresa.id}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
