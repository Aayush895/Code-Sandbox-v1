import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import useEditorStore from './useEditorStore'

const useEditorSocketStore = create(
  devtools((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocketObj) => {
      const activeFileSetterFn = useEditorStore.getState().setActiveFile
      const fileContentsSetterFn = useEditorStore.getState().setFileContents

      incomingSocketObj?.on('read-file-success', ({ fileData, activeFile }) => {
        activeFileSetterFn(activeFile)
        fileContentsSetterFn(fileData)
      })

      incomingSocketObj?.on('write-file-success', ({ activeFile, message }) => {
        incomingSocketObj?.emit('read-file', {
          filePath: activeFile,
        })
        console.log(message)
      })

      set({
        editorSocket: incomingSocketObj,
      })
    },
  })),
)

export default useEditorSocketStore
