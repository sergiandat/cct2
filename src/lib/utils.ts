import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays, format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import numeral from "numeral"
import {
  UMBRALES_CRITICIDAD,
  PESOS_CRITICIDAD,
  ESTADO_COLORS
} from "./constants"
import type {
  Empresa,
  NivelCriticidad,
  EstadoConvenio,
  NivelSalarial
} from "./types"

// ============================================
// UTILIDADES DE CLASES CSS
// ============================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// FORMATEO DE MONEDA
// ============================================
export function formatMoney(value: number): string {
  return numeral(value).format('$0,0')
}

export function formatMoneyCompact(value: number): string {
  if (value >= 1000000) {
    return numeral(value).format('$0.0a').toUpperCase()
  }
  return numeral(value).format('$0,0')
}

// ============================================
// FORMATEO DE PORCENTAJES
// ============================================
export function formatPercent(value: number, decimals: number = 1): string {
  const percent = value * 100
  const sign = percent > 0 ? '+' : ''
  return `${sign}${percent.toFixed(decimals)}%`
}

export function formatPercentAbs(value: number, decimals: number = 1): string {
  const percent = Math.abs(value * 100)
  return `${percent.toFixed(decimals)}%`
}

// ============================================
// FORMATEO DE FECHAS
// ============================================
export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "dd/MM/yyyy", { locale: es })
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "dd MMM yyyy", { locale: es })
}

export function formatDateRelative(dateStr: string): string {
  const days = diasHastaFecha(dateStr)
  if (days < 0) {
    return `hace ${Math.abs(days)} días`
  } else if (days === 0) {
    return 'hoy'
  } else if (days === 1) {
    return 'mañana'
  } else if (days <= 30) {
    return `en ${days} días`
  } else if (days <= 90) {
    const meses = Math.round(days / 30)
    return `en ${meses} ${meses === 1 ? 'mes' : 'meses'}`
  } else {
    return formatDateShort(dateStr)
  }
}

// ============================================
// CÁLCULOS DE FECHAS
// ============================================
export function diasHastaFecha(dateStr: string): number {
  return differenceInDays(parseISO(dateStr), new Date())
}

export function estaVencido(dateStr: string): boolean {
  return diasHastaFecha(dateStr) < 0
}

export function estaPorVencer(dateStr: string, dias: number = 90): boolean {
  const diff = diasHastaFecha(dateStr)
  return diff >= 0 && diff <= dias
}

// ============================================
// CÁLCULO DE CRITICIDAD
// ============================================
export function calcularCriticidad(empresa: Empresa): number {
  const diasVenc = diasHastaFecha(empresa.vencimiento)
  const brecha = Math.abs(empresa.brechaInflacion)
  const clausulasFaltantes = empresa.clausulasAusentes

  // Normalizar días de vencimiento (0-1)
  let scoreVenc = 0
  if (diasVenc <= 0) {
    scoreVenc = 1 // Ya vencido = máxima criticidad
  } else if (diasVenc <= UMBRALES_CRITICIDAD.vencimiento.critico) {
    scoreVenc = 0.9
  } else if (diasVenc <= UMBRALES_CRITICIDAD.vencimiento.alto) {
    scoreVenc = 0.7
  } else if (diasVenc <= UMBRALES_CRITICIDAD.vencimiento.medio) {
    scoreVenc = 0.4
  } else {
    scoreVenc = 0.1
  }

  // Normalizar brecha (0-1)
  let scoreBrecha = Math.min(brecha / 0.20, 1) // Máximo 20%

  // Normalizar cláusulas (0-1)
  let scoreClausulas = Math.min(clausulasFaltantes / 10, 1) // Máximo 10

  // Calcular score final ponderado
  return (
    scoreVenc * PESOS_CRITICIDAD.vencimiento +
    scoreBrecha * PESOS_CRITICIDAD.brecha +
    scoreClausulas * PESOS_CRITICIDAD.clausulas
  )
}

export function getNivelCriticidad(score: number): NivelCriticidad {
  if (score >= 0.7) return 'critico'
  if (score >= 0.5) return 'alto'
  if (score >= 0.3) return 'medio'
  return 'bajo'
}

export function getCriticidadColors(nivel: NivelCriticidad) {
  return ESTADO_COLORS[nivel]
}

// ============================================
// ESTADO DE CONVENIO
// ============================================
export function getEstadoConvenio(empresa: Empresa): EstadoConvenio {
  if (empresa.estado === 'en_negociacion') return 'en_negociacion'
  if (estaVencido(empresa.vencimiento)) return 'vencido'
  if (estaPorVencer(empresa.vencimiento, 90)) return 'por_vencer'
  return 'vigente'
}

export function getEstadoLabel(estado: EstadoConvenio): string {
  const labels: Record<EstadoConvenio, string> = {
    vigente: 'Vigente',
    por_vencer: 'Por vencer',
    vencido: 'Vencido',
    en_negociacion: 'En negociación',
  }
  return labels[estado]
}

// ============================================
// CÁLCULOS SALARIALES
// ============================================
export function calcularTotalNivel(nivel: NivelSalarial): number {
  return nivel.basico + (nivel.zona || 0) + (nivel.antiguedad || 0) + (nivel.titulo || 0)
}

export function calcularProyeccion(
  nivelActual: NivelSalarial,
  params: {
    aumentoPorcentaje: number
    sumaFija: number
    incluirZona: boolean
    zonaPercent: number
  }
): NivelSalarial {
  const nuevoBasico = nivelActual.basico * (1 + params.aumentoPorcentaje / 100) + params.sumaFija
  const nuevaZona = params.incluirZona ? nuevoBasico * (params.zonaPercent / 100) : nivelActual.zona

  return {
    ...nivelActual,
    basico: nuevoBasico,
    zona: nuevaZona,
    total: nuevoBasico + nuevaZona + (nivelActual.antiguedad || 0) + (nivelActual.titulo || 0),
  }
}

// ============================================
// COMPARACIONES
// ============================================
export function calcularBrechaPercent(valor: number, referencia: number): number {
  if (referencia === 0) return 0
  return (valor - referencia) / referencia
}

export function getColorBrecha(brecha: number): 'green' | 'yellow' | 'red' | 'gray' {
  if (brecha >= 0.05) return 'green'
  if (brecha >= -0.05) return 'yellow'
  return 'red'
}

// ============================================
// BÚSQUEDA
// ============================================
export function matchKeywords(texto: string, keywords: string[]): boolean {
  const textoLower = texto.toLowerCase()
  return keywords.some(kw => textoLower.includes(kw.toLowerCase()))
}

export function highlightText(text: string, query: string): string {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// ============================================
// ORDENAMIENTO
// ============================================
export function ordenarPorCriticidad(empresas: Empresa[]): Empresa[] {
  return [...empresas].sort((a, b) => {
    const critA = a.criticidad ?? calcularCriticidad(a)
    const critB = b.criticidad ?? calcularCriticidad(b)
    return critB - critA // Mayor criticidad primero
  })
}

// ============================================
// GENERACIÓN DE IDs
// ============================================
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}
