# Sistema Gremial - Mock-up Interactivo

## Descripción del Proyecto
Prototipo interactivo de una plataforma de gestión integral para gremios argentinos, enfocado en convenios colectivos de trabajo (CCT) y desarrollo profesional de afiliados.

**Cliente piloto:** APUAYE (Profesionales Universitarios del Agua y Energía)

---

## Progreso del Desarrollo

### Completado ✅
- [x] Análisis de documentos de propuesta original
- [x] Identificación de mejoras funcionales
- [x] Definición de estructura del proyecto
- [x] Creación de package.json, tsconfig.json, tailwind.config.ts, next.config.mjs
- [x] Tipos TypeScript (`src/lib/types.ts`)
- [x] Constantes y utilidades (`src/lib/constants.ts`, `src/lib/utils.ts`)
- [x] Datos de demo JSON (empresas, escalas, cláusulas, alertas, consultas)
- [x] Store Zustand (`src/stores/useAppStore.ts`)
- [x] Componentes UI base (Button, Card, Badge)
- [x] Layout (Sidebar, Header, CommandMenu con Cmd+K)
- [x] **Dashboard** con diagnóstico de criticidad y alertas ordenadas
- [x] **Comparador** multi-empresa con reglas de equivalencia y heatmap
- [x] **Semáforo de cláusulas** con filtros por categoría y tema
- [x] **Chat RAG guiado** con preguntas sugeridas y fuentes visibles
- [x] **Listado de empresas** con filtros y ordenamiento por criticidad
- [x] **Detalle de empresa** con métricas y resumen de cláusulas
- [x] **Simulador de paritaria** integrado en detalle de empresa
- [x] **Calendario** con vencimientos y eventos próximos

### Estado: COMPLETO 🎉
El mock-up interactivo está listo para ejecutar con `npm run dev`

---

## Mejoras Incorporadas (vs propuesta original)

### 1. Dashboard Diagnóstico
- **Antes:** Mostraba métricas (128 activos, 17 por vencer)
- **Después:** Muestra problemas ("TRANSPA está 16% abajo y vence en 15 días")
- **Valor:** El usuario ve problemas, no datos

### 2. Reglas de Comparación
- Agregar panel de criterios: equivalencia directa / aproximada / no comparable
- Evita lecturas erróneas y da respaldo legal

### 3. Semáforo de Cláusulas
- Mapa visual por tema: presente / ausente / parcial
- Detecta inequidades no salariales de un vistazo

### 4. Alertas por Criticidad
- Ordenadas por impacto combinado (vencimiento + brecha + cláusulas)
- No solo por fecha de vencimiento

### 5. Lectura Histórica
- Evolución interperíodo y brechas persistentes
- Refuerza argumentos de negociación

### 6. Chat Guiado
- Preguntas sugeridas contextuales
- Fuentes siempre visibles junto a respuestas

### 7. Trazabilidad Visible
- Botón directo desde cualquier dato a documento/página/cláusula
- Fundamental para equipos legales

### 8. Simulador "Qué Pasa Si"
- Variables: aumento, suma fija, nuevos adicionales, corrección histórica
- Comparación entre escenarios guardados

---

## Estructura del Proyecto

```
/gremio-mockup
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Dashboard
│   │   ├── empresas/
│   │   │   ├── page.tsx          # Lista de empresas
│   │   │   └── [id]/page.tsx     # Detalle empresa
│   │   ├── comparador/page.tsx   # Comparador multi-empresa
│   │   ├── clausulas/page.tsx    # Semáforo de cláusulas
│   │   ├── consultas/page.tsx    # Chat RAG
│   │   ├── paritaria/[id]/page.tsx # Simulador
│   │   └── calendario/page.tsx   # Calendario alertas
│   │
│   ├── components/
│   │   ├── ui/                   # Componentes base (shadcn)
│   │   ├── layout/               # Sidebar, Header, CommandMenu
│   │   ├── dashboard/            # Cards, alertas, diagnóstico
│   │   ├── comparador/           # Heatmap, reglas, tabla
│   │   ├── clausulas/            # Semáforo visual
│   │   ├── consultas/            # Chat, sugerencias
│   │   ├── paritaria/            # Simulador, escenarios
│   │   └── shared/               # Componentes reutilizables
│   │
│   ├── data/                     # JSON de datos demo
│   │   ├── empresas.json
│   │   ├── escalas.json
│   │   ├── clausulas.json
│   │   ├── alertas.json
│   │   └── consultas-demo.json
│   │
│   ├── lib/
│   │   ├── types.ts              # Interfaces TypeScript
│   │   ├── utils.ts              # Helpers
│   │   ├── constants.ts          # Colores, estados
│   │   └── calculos.ts           # Lógica de simulación
│   │
│   └── stores/
│       └── useAppStore.ts        # Zustand store
│
├── public/
│   └── documentos/               # PDFs de ejemplo
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── CLAUDE.md                     # Este archivo
```

---

## Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Framework | Next.js 14 (App Router) | SSR, routing, optimizaciones |
| UI | Tailwind + shadcn/ui | Componentes accesibles, customizables |
| Gráficos | Recharts | Simple, React nativo |
| Estado | Zustand | Ligero, sin boilerplate |
| Búsqueda | cmdk | Cmd+K estilo Spotlight |
| Notificaciones | Sonner | Toast elegantes |

---

## Flujos Principales a Implementar

### Flujo 1: Diagnóstico Rápido
```
Dashboard → Ver problema → Click en empresa → Ver detalle → Acción
```

### Flujo 2: Preparar Paritaria
```
Alerta crítica → Empresa → Comparador → Simulador → Exportar
```

### Flujo 3: Consulta con Contexto
```
Chat → Pregunta sugerida → Respuesta con fuente → Click ver documento
```

### Flujo 4: Detectar Inequidad
```
Semáforo cláusulas → Filtrar por tema → Identificar ausencias → Exportar
```

---

## Datos de Demo

### Empresas principales (10)
1. TRANSENER S.A. - referencia positiva
2. TRANSPA S.A. - caso crítico (vence pronto, brecha alta)
3. EDENOR S.A. - en negociación
4. EDESUR S.A. - vigente
5. CAMMESA - vigente con alertas menores
6. EDELAP S.A.
7. EDEN S.A.
8. EPEC
9. AES Argentina
10. Central Puerto

### Categorías (APUAYE)
- U-V: Profesional Experto
- U-IV: Profesional Coordinador
- U-III: Profesional Especialista
- U-II: Profesional Asistente
- U-I: Joven Profesional

### Cláusulas a mapear
- Licencias: paternidad, estudio, mudanza, examen, matrimonio
- Adicionales: zona, título, antigüedad, riesgo, turno
- Jornada: horas, francos, guardias
- Beneficios: comedor, guardería, transporte

---

## Notas de Implementación

### Colores de estado
```typescript
const ESTADO_COLORS = {
  critico: 'bg-red-500',    // vencido o brecha > 15%
  alto: 'bg-orange-500',    // vence < 30 días o brecha > 10%
  medio: 'bg-yellow-500',   // vence < 90 días o brecha > 5%
  ok: 'bg-green-500',       // vigente y sin brechas
  ausente: 'bg-gray-400',   // cláusula no presente
}
```

### Fórmula de criticidad
```typescript
const calcularCriticidad = (empresa) => {
  const diasVenc = diasHastaVencimiento(empresa.vencimiento)
  const brecha = Math.abs(empresa.brechaInflacion)
  const clausulasFaltantes = contarClausulasAusentes(empresa.id)

  // Peso: vencimiento 30%, brecha 40%, cláusulas 30%
  return (
    (Math.max(0, 90 - diasVenc) / 90) * 0.3 +
    (brecha * 100) * 0.4 +
    (clausulasFaltantes / 10) * 0.3
  )
}
```

---

## Decisiones de Diseño

1. **Sin autenticación en mock-up** - Todos los datos visibles, simula usuario "Ged"
2. **Datos estáticos en JSON** - No hay backend, todo se carga desde archivos
3. **Chat simulado** - Respuestas pre-cargadas que matchean por keywords
4. **Exportación simulada** - Botones que descargan PDFs de ejemplo
5. **Una sola vista (no roles)** - Vista "negociador" que tiene todo

---

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Build producción
npm run build

# Correr producción
npm start
```

---

## Changelog

### 2026-02-03
- Creación inicial del proyecto
- Análisis de propuesta original
- Definición de mejoras
- Inicio de estructura Next.js
- Implementación completa del mock-up:
  - Dashboard con diagnóstico de criticidad
  - Comparador multi-empresa con equivalencias
  - Semáforo de cláusulas con heatmap
  - Chat RAG guiado con preguntas sugeridas
  - Listado de empresas con filtros
  - Detalle de empresa con simulador de paritaria
  - Calendario de vencimientos y eventos

## Archivos Creados

### Configuración
- `package.json` - Dependencias del proyecto
- `tsconfig.json` - Configuración TypeScript
- `tailwind.config.ts` - Configuración Tailwind CSS
- `next.config.mjs` - Configuración Next.js
- `postcss.config.mjs` - PostCSS para Tailwind

### Core (`src/lib/`)
- `types.ts` - Interfaces TypeScript
- `constants.ts` - Colores, categorías, cláusulas, menú
- `utils.ts` - Helpers de formato, cálculos, criticidad

### Datos (`src/data/`)
- `empresas.json` - 10 empresas con métricas
- `escalas.json` - Escalas salariales por categoría
- `clausulas.json` - Estado de 18 cláusulas por empresa
- `alertas.json` - 7 alertas con criticidad
- `consultas-demo.json` - 7 Q&A para RAG simulado

### Estado (`src/stores/`)
- `useAppStore.ts` - Zustand store global

### Componentes UI (`src/components/ui/`)
- `button.tsx`, `card.tsx`, `badge.tsx`

### Layout (`src/components/layout/`)
- `Sidebar.tsx` - Navegación lateral colapsable
- `Header.tsx` - Búsqueda y notificaciones
- `CommandMenu.tsx` - Cmd+K spotlight

### Dashboard (`src/components/dashboard/`)
- `StatsCards.tsx` - Métricas principales
- `DiagnosticoPanel.tsx` - Empresas críticas con barras
- `AccionesRapidas.tsx` - Accesos rápidos
- `AlertasRecientes.tsx` - Alertas por criticidad
- `EmpresasTable.tsx` - Tabla resumen

### Páginas (`src/app/`)
- `layout.tsx` - Layout principal con Sidebar
- `page.tsx` - Dashboard
- `comparador/page.tsx` - Comparador multi-empresa
- `clausulas/page.tsx` - Semáforo de cláusulas
- `consultas/page.tsx` - Chat RAG guiado
- `empresas/page.tsx` - Listado de empresas
- `empresas/[id]/page.tsx` - Detalle + simulador paritaria
- `calendario/page.tsx` - Calendario de eventos
