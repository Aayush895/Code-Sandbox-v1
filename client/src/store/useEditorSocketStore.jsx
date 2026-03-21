import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { fetchProjectTree } from '../Apis/projectApis'
import useEditorStore from './useEditorStore'
import useProjectStore from './useProjectStore'

const useEditorSocketStore = create(
  devtools((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocketObj) => {
      const activeFileSetterFn = useEditorStore.getState().setActiveFile
      const fileContentsSetterFn = useEditorStore.getState().setFileContents
      const projectStructureSetterFn =
        useProjectStore.getState().setProjectStructure

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

      incomingSocketObj?.on('delete-file-success', async ({ projectId }) => {
        const projectStructureAfterFileDeletion =
          await fetchProjectTree(projectId)
        projectStructureSetterFn(projectStructureAfterFileDeletion)
      })

      incomingSocketObj?.on('delete-folder-success', async ({ projectId }) => {
        const projectStructureAfterFolderDeletion =
          await fetchProjectTree(projectId)
        projectStructureSetterFn(projectStructureAfterFolderDeletion)
      })

      incomingSocketObj?.on('create-folder-success', async ({ projectId }) => {
        const projectStructureAfterFolderAddition =
          await fetchProjectTree(projectId)
        projectStructureSetterFn(projectStructureAfterFolderAddition)
      })

      set({
        editorSocket: incomingSocketObj,
      })
    },
  })),
)

export default useEditorSocketStore
