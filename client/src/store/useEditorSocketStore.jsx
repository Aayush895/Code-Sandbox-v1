import { create } from 'zustand'
import useEditorStore from './useEditorStore'

const useEditorSocketStore = create((set) => ({
  editorSocket: null,
  setEditorSocket: (incomingSocketObj) => {
    const activeFileSetterFn = useEditorStore.getState().setActiveFile
    const fileContentsSetterFn = useEditorStore.getState().setFileContents

    incomingSocketObj?.on('read-file-success', ({ fileData, activeFile }) => {
      activeFileSetterFn(activeFile)
      fileContentsSetterFn(fileData)
    })

    set({
      editorSocket: incomingSocketObj,
    })
  },
}))

export default useEditorSocketStore
