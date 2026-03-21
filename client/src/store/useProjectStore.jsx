import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useProjectStore = create(
  devtools((set) => ({
    projectName: '',
    setProjectName: function (incomingProjectName) {
      set({ projectName: incomingProjectName })
    },
    projectStructure: null,
    setProjectStructure: function (incomingProjectStructure) {
      set({ projectStructure: incomingProjectStructure })
    },
  })),
)

export default useProjectStore
