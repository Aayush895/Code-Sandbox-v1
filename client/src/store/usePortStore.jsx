import { create } from 'zustand'

export const usePortStore = create((set, get) => ({
  ports: {
    vite: null, 
    express: null,
  },

  // which preview to show (only matters when both exist)
  activePreview: 'vite', // 'vite' | 'express'

  // optional: set this when user selects a template (react/express/fullstack)
  projectType: null, // 'react' | 'express' | 'fullstack'

  setPorts: (incoming) =>
    set((state) => {
      const next = {
        vite: incoming?.vite ?? state.ports.vite ?? null,
        express: incoming?.express ?? state.ports.express ?? null,
      }

      // auto-select if current active preview doesn't exist
      let active = state.activePreview
      if (active === 'vite' && !next.vite && next.express) active = 'express'
      if (active === 'express' && !next.express && next.vite) active = 'vite'

      return { ports: next, activePreview: active }
    }),

  setActivePreview: (activePreview) => set({ activePreview }),

  setProjectType: (projectType) => set({ projectType }),

  // convenience getter
  getActivePort: () => {
    const { ports, activePreview } = get()
    return (
      (activePreview === 'vite' ? ports.vite : ports.express) ||
      ports.vite ||
      ports.express
    )
  },

  clearPorts: () =>
    set({
      ports: { vite: null, express: null },
      activePreview: 'vite',
      projectType: null,
    }),
}))
