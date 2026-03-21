import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useEditorStore = create(
  devtools((set) => ({
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
  })),
)

export default useEditorStore
