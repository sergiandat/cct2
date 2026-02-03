import { create } from 'zustand'
import type { AppState, MensajeChat, EscenarioParitaria } from '@/lib/types'
import { generateId } from '@/lib/utils'

export const useAppStore = create<AppState>((set) => ({
  // Empresa seleccionada
  empresaActual: null,
  setEmpresaActual: (id) => set({ empresaActual: id }),

  // Empresas para comparar
  empresasComparar: [],
  addEmpresaComparar: (id) =>
    set((state) => ({
      empresasComparar: state.empresasComparar.includes(id)
        ? state.empresasComparar
        : [...state.empresasComparar, id],
    })),
  removeEmpresaComparar: (id) =>
    set((state) => ({
      empresasComparar: state.empresasComparar.filter((e) => e !== id),
    })),
  clearComparacion: () => set({ empresasComparar: [] }),

  // Chat
  mensajes: [],
  addMensaje: (mensaje) =>
    set((state) => ({
      mensajes: [
        ...state.mensajes,
        {
          ...mensaje,
          id: generateId(),
          timestamp: new Date(),
        },
      ],
    })),
  clearMensajes: () => set({ mensajes: [] }),

  // Escenarios paritaria
  escenarios: [],
  addEscenario: (escenario) =>
    set((state) => ({
      escenarios: [
        ...state.escenarios,
        {
          ...escenario,
          id: generateId(),
        },
      ],
    })),
  removeEscenario: (id) =>
    set((state) => ({
      escenarios: state.escenarios.filter((e) => e.id !== id),
    })),

  // UI
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  commandMenuOpen: false,
  setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
}))
