import { create } from 'zustand'

export const usePortStore = create((set) => ({
  port: null,
  projectType: null,
  setPort: (incomingPort) => {
    set({ port: incomingPort })
  },
}))
