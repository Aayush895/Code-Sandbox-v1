import { create } from 'zustand'

const useProjectStore = create((set) => ({
  projectName: '',
  setProjectName: function (incomingProjectName) {
    set({ projectName: incomingProjectName })
  },
  projectStructure: null,
  setProjectStructure: function (incomingProjectStructure) {
    set({ projectStructure: incomingProjectStructure })
  },
}))

export default useProjectStore
