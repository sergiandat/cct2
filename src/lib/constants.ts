// ============================================
// CONSTANTES DEL SISTEMA GREMIAL
// ============================================

// Colores por estado
export const ESTADO_COLORS = {
  critico: {
    bg: 'bg-red-500',
    bgLight: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  alto: {
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  },
  medio: {
    bg: 'bg-yellow-500',
    bgLight: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  bajo: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  ausente: {
    bg: 'bg-gray-400',
    bgLight: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
} as const

// Colores para semáforo de cláusulas
export const CLAUSULA_COLORS = {
  presente: 'bg-green-500',
  ausente: 'bg-gray-400',
  parcial: 'bg-yellow-500',
  mejor: 'bg-green-600',
  peor: 'bg-red-500',
} as const

// Colores para comparación
export const COMPARACION_COLORS = {
  green: 'bg-green-500 text-white',
  yellow: 'bg-yellow-500 text-black',
  red: 'bg-red-500 text-white',
  gray: 'bg-gray-300 text-gray-600',
} as const

// Categorías APUAYE
export const CATEGORIAS_APUAYE = [
  { codigo: 'U-V', nombre: 'Profesional Experto', nivel: 5 },
  { codigo: 'U-IV', nombre: 'Profesional Coordinador', nivel: 4 },
  { codigo: 'U-III', nombre: 'Profesional Especialista', nivel: 3 },
  { codigo: 'U-II', nombre: 'Profesional Asistente', nivel: 2 },
  { codigo: 'U-I', nombre: 'Joven Profesional', nivel: 1 },
] as const

// Categorías de cláusulas
export const CATEGORIAS_CLAUSULAS = [
  { id: 'licencias', nombre: 'Licencias', icon: 'Calendar' },
  { id: 'adicionales', nombre: 'Adicionales', icon: 'DollarSign' },
  { id: 'jornada', nombre: 'Jornada', icon: 'Clock' },
  { id: 'beneficios', nombre: 'Beneficios', icon: 'Gift' },
] as const

// Cláusulas a mapear
export const CLAUSULAS = [
  // Licencias
  { id: 'lic_paternidad', categoria: 'licencias', nombre: 'Licencia Paternidad', unidad: 'días' },
  { id: 'lic_estudio', categoria: 'licencias', nombre: 'Licencia Estudio', unidad: 'días' },
  { id: 'lic_mudanza', categoria: 'licencias', nombre: 'Licencia Mudanza', unidad: 'días' },
  { id: 'lic_matrimonio', categoria: 'licencias', nombre: 'Licencia Matrimonio', unidad: 'días' },
  { id: 'lic_fallecimiento', categoria: 'licencias', nombre: 'Licencia Fallecimiento', unidad: 'días' },
  { id: 'vacaciones_extra', categoria: 'licencias', nombre: 'Vacaciones Extra', unidad: 'días' },

  // Adicionales
  { id: 'adic_zona', categoria: 'adicionales', nombre: 'Adicional Zona', unidad: '%' },
  { id: 'adic_titulo', categoria: 'adicionales', nombre: 'Adicional Título', unidad: '%' },
  { id: 'adic_antiguedad', categoria: 'adicionales', nombre: 'Adicional Antigüedad', unidad: '%/año' },
  { id: 'adic_riesgo', categoria: 'adicionales', nombre: 'Adicional Riesgo', unidad: '%' },
  { id: 'adic_turno', categoria: 'adicionales', nombre: 'Adicional Turno', unidad: '%' },

  // Jornada
  { id: 'jornada_horas', categoria: 'jornada', nombre: 'Horas Semanales', unidad: 'hs' },
  { id: 'jornada_francos', categoria: 'jornada', nombre: 'Francos Semanales', unidad: 'días' },
  { id: 'jornada_guardias', categoria: 'jornada', nombre: 'Régimen Guardias', unidad: '' },

  // Beneficios
  { id: 'benef_comedor', categoria: 'beneficios', nombre: 'Comedor', unidad: '' },
  { id: 'benef_guarderia', categoria: 'beneficios', nombre: 'Guardería', unidad: '' },
  { id: 'benef_transporte', categoria: 'beneficios', nombre: 'Transporte', unidad: '' },
  { id: 'benef_bono_anual', categoria: 'beneficios', nombre: 'Bono Anual', unidad: 'sueldos' },
] as const

// Menú de navegación
export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/' },
  { id: 'empresas', label: 'Empresas', icon: 'Building2', href: '/empresas' },
  { id: 'comparador', label: 'Comparador', icon: 'GitCompare', href: '/comparador' },
  { id: 'clausulas', label: 'Cláusulas', icon: 'FileCheck', href: '/clausulas' },
  { id: 'consultas', label: 'Consultas', icon: 'MessageSquare', href: '/consultas' },
  { id: 'calendario', label: 'Calendario', icon: 'CalendarDays', href: '/calendario' },
] as const

// Preguntas sugeridas para el chat
export const PREGUNTAS_SUGERIDAS = [
  '¿Dónde estamos peor que el promedio del sector?',
  '¿Qué empresas pagan adicional por zona?',
  '¿Cuántos días de licencia por paternidad en cada empresa?',
  '¿Qué requisitos tiene la categoría U-IV?',
  '¿Cuál es la brecha acumulada en TRANSPA?',
  'Comparar vacaciones entre TRANSENER y TRANSPA',
  '¿Qué empresas tienen mejor régimen de guardias?',
] as const

// Umbrales para cálculo de criticidad
export const UMBRALES_CRITICIDAD = {
  vencimiento: {
    critico: 15, // días
    alto: 30,
    medio: 90,
  },
  brecha: {
    critico: 0.15, // 15%
    alto: 0.10,
    medio: 0.05,
  },
  clausulas: {
    critico: 5, // cantidad ausentes
    alto: 3,
    medio: 1,
  },
} as const

// Pesos para cálculo de criticidad
export const PESOS_CRITICIDAD = {
  vencimiento: 0.3,
  brecha: 0.4,
  clausulas: 0.3,
} as const

// Formato de moneda
export const FORMATO_MONEDA = {
  locale: 'es-AR',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} as const

// Usuario demo
export const USUARIO_DEMO = {
  nombre: 'Ged',
  rol: 'Negociador',
  gremio: 'APUAYE',
  avatar: '/avatar-demo.png',
} as const
