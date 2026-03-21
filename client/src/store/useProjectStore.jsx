import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useProjectStore = create(
  devtools((set) => ({
    projectStructure: null,
    setProjectStructure: function (incomingProjectStructure) {
      set({ projectStructure: incomingProjectStructure })
    },
  })),
)

export default useProjectStore
