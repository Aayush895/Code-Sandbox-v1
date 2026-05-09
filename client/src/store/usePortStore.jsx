import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePortStore = create(
  persist(
    (set) => ({
      ports: {
        react: null,
        express: null,
      },
      projectTypeIdentification: null,

      setPorts: (incomingPorts) =>
        set({
          ports: {
            react: incomingPorts?.react,
            express: incomingPorts?.express,
          },
        }),

      setProjectTypeIdentification: (incomingType) => {
        set({ projectTypeIdentification: incomingType })
      },
    }),
    {
      name: 'port-store', // localStorage key
      partialize: (state) => ({
        projectTypeIdentification: state.projectTypeIdentification,
        // Don't persist ports — re-fetch them fresh via socket
      }),
    },
  ),
)
