import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { fetchProjectTree } from '../Apis/projectApis'
import useEditorStore from './useEditorStore'
import { usePortStore } from './usePortStore'
import useProjectStore from './useProjectStore'

const useEditorSocketStore = create(
  devtools((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocketObj) => {
      const activeFileSetterFn = useEditorStore.getState().setActiveFile
      const fileContentsSetterFn = useEditorStore.getState().setFileContents
      const projectStructureSetterFn =
        useProjectStore.getState().setProjectStructure

      const setPorts = usePortStore.getState().setPorts
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

      incomingSocketObj?.on('create-file-success', async ({ projectId }) => {
        const projectStructureAfterFileAddition =
          await fetchProjectTree(projectId)

        projectStructureSetterFn(projectStructureAfterFileAddition)
      })

      incomingSocketObj?.on('rename-file-success', async ({ projectId }) => {
        const projectStructureAfterRenamingFile =
          await fetchProjectTree(projectId)

        projectStructureSetterFn(projectStructureAfterRenamingFile)
      })

      incomingSocketObj?.on('rename-folder-success', async ({ projectId }) => {
        const projectStructureAfterRenamingFolder =
          await fetchProjectTree(projectId)

        projectStructureSetterFn(projectStructureAfterRenamingFolder)
      })

      incomingSocketObj?.on('file:change', async ({ projectId }) => {
        const projectStructureAfterSomeFileChanges =
          await fetchProjectTree(projectId)

        projectStructureSetterFn(projectStructureAfterSomeFileChanges)
      })

      incomingSocketObj?.on('fetch-port-success', ({ ports }) => {
        // New backend shape: ports = { vite: "123", express: "456" }
        // Backward-compat: if ports is array, map [0] -> vite, [1] -> express
        if (Array.isArray(ports)) {
          setPorts({ vite: ports[0] ?? null, express: ports[1] ?? null })
          return
        }

        setPorts({
          vite: ports?.vite ?? null,
          express: ports?.express ?? null,
        })
      })

      set({
        editorSocket: incomingSocketObj,
      })
    },
  })),
)

export default useEditorSocketStore
