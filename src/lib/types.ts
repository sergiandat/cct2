// ============================================
// TIPOS PRINCIPALES DEL SISTEMA GREMIAL
// ============================================

// Estados posibles de un convenio/empresa
export type EstadoConvenio = 'vigente' | 'por_vencer' | 'vencido' | 'en_negociacion'

// Niveles de criticidad para alertas
export type NivelCriticidad = 'critico' | 'alto' | 'medio' | 'bajo'

// Estado de una cláusula en comparación
export type EstadoClausula = 'presente' | 'ausente' | 'parcial' | 'mejor' | 'peor'

// Tipo de equivalencia en comparación
export type TipoEquivalencia = 'directa' | 'aproximada' | 'no_comparable'

// ============================================
// EMPRESA
// ============================================
export interface Empresa {
  id: string
  nombre: string
  cuit: string
  cct: string
  estado: EstadoConvenio
  vencimiento: string // ISO date
  afiliados: number
  ultimoAcuerdo: string // ISO date
  brechaInflacion: number // -0.196 = -19.6%
  brechaSector: number
  clausulasAusentes: number
  criticidad?: number // Calculado
}

// ============================================
// ESCALA SALARIAL
// ============================================
export interface NivelSalarial {
  categoria: string // U-I, U-II, etc.
  nombre: string // Joven Profesional, etc.
  basico: number
  zona: number
  antiguedad?: number
  titulo?: number
  total?: number // Calculado
}

export interface EscalaSalarial {
  empresaId: string
  vigente: string // ISO date
  niveles: NivelSalarial[]
}

// ============================================
// CLÁUSULAS
// ============================================
export interface Clausula {
  id: string
  categoria: 'licencias' | 'adicionales' | 'jornada' | 'beneficios'
  nombre: string
  descripcion?: string
}

export interface ClausulaEmpresa {
  clausulaId: string
  empresaId: string
  estado: EstadoClausula
  valor?: string | number
  articulo?: string
  pagina?: number
  texto?: string
}

// Mapa de cláusulas para semáforo
export interface MapaClausulas {
  [empresaId: string]: {
    [clausulaId: string]: ClausulaEmpresa
  }
}

// ============================================
// ALERTAS
// ============================================
export interface Alerta {
  id: string
  empresaId: string
  tipo: 'vencimiento' | 'brecha' | 'clausula' | 'negociacion'
  nivel: NivelCriticidad
  titulo: string
  descripcion: string
  fecha: string
  impacto?: string
  accionSugerida?: string
}

// ============================================
// COMPARACIÓN
// ============================================
export interface ComparacionEmpresa {
  empresaId: string
  nombre: string
  equivalencia: TipoEquivalencia
  razonEquivalencia?: string
}

export interface ResultadoComparacion {
  variable: string
  valores: {
    empresaId: string
    valor: number | string
    vsSector: number // porcentaje vs promedio
    color: 'green' | 'yellow' | 'red' | 'gray'
  }[]
  insight?: string
}

// ============================================
// CONSULTAS RAG
// ============================================
export interface FuenteConsulta {
  documento: string
  articulo: string
  pagina: number
  texto: string
}

export interface ConsultaDemo {
  id: string
  keywords: string[]
  pregunta: string
  respuesta: string
  datos?: Array<Record<string, any>>
  fuentes: FuenteConsulta[]
  insight?: string
}

export interface MensajeChat {
  id: string
  role: 'user' | 'assistant'
  content: string
  fuentes?: FuenteConsulta[]
  timestamp: Date
}

// ============================================
// PARITARIA / SIMULADOR
// ============================================
export interface EscenarioParitaria {
  id: string
  nombre: string
  empresaId: string
  fecha: string
  parametros: {
    aumentoPorcentaje: number
    sumaFija: number
    incluirZona: boolean
    correccionHistorica: number
  }
  proyeccion: ProyeccionNivel[]
  impacto: ImpactoEscenario
}

export interface ProyeccionNivel {
  categoria: string
  actual: number
  propuesto: number
  vsSector: number
  vsReferencia: number // vs mejor empresa
}

export interface ImpactoEscenario {
  cierraInflacion: boolean
  cierraSector: boolean
  cierraReferencia: boolean
  costoEstimado: number
}

// ============================================
// HISTORIAL
// ============================================
export interface RegistroHistorico {
  empresaId: string
  anio: number
  pedido: number // porcentaje
  obtenido: number
  inflacion: number
  resultado: number // ganancia/pérdida en pp
}

export interface BrechaHistorica {
  empresaId: string
  vsInflacion: number[] // por año
  vsReferencia: number[] // por año
  acumuladoInflacion: number
  acumuladoReferencia: number
  tendencia: 'creciente' | 'estable' | 'decreciente'
}

// ============================================
// NAVEGACIÓN / UI
// ============================================
export interface MenuItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: number
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

// ============================================
// STORE
// ============================================
export interface AppState {
  // Empresa seleccionada
  empresaActual: string | null
  setEmpresaActual: (id: string | null) => void

  // Empresas para comparar
  empresasComparar: string[]
  addEmpresaComparar: (id: string) => void
  removeEmpresaComparar: (id: string) => void
  clearComparacion: () => void

  // Chat
  mensajes: MensajeChat[]
  addMensaje: (mensaje: Omit<MensajeChat, 'id' | 'timestamp'>) => void
  clearMensajes: () => void

  // Escenarios paritaria
  escenarios: EscenarioParitaria[]
  addEscenario: (escenario: Omit<EscenarioParitaria, 'id'>) => void
  removeEscenario: (id: string) => void

  // UI
  sidebarOpen: boolean
  toggleSidebar: () => void
  commandMenuOpen: boolean
  setCommandMenuOpen: (open: boolean) => void
}
