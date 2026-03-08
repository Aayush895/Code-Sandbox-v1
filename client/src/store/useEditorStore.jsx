import { create } from 'zustand'

const useEditorStore = create((set) => ({
  fileContents: '',
  setFileContents: function (parsedFileContents) {
    set({ fileContents: parsedFileContents })
  },
  activeFile: '',
  setActiveFile: function (activeFilePath) {
    set({
      activeFile: activeFilePath,
    })
  },
}))

export default useEditorStore
