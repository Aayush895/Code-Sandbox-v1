import { useParams } from 'react-router'
import useContextMenuStore from '../../store/useContextMenuStore'
import useEditorSocketStore from '../../store/useEditorSocketStore'
function ContextMenu({
  xCoord,
  yCoord,
  newEntry,
  setNewEntry,
  renameFileOrFolder,
  setRenameFileOrFolder,
}) {
  const { editorSocket } = useEditorSocketStore()
  const { selectedFolderPath, selectedFilePath } = useContextMenuStore()

  const { projectId } = useParams()

  function shouldFile_FolderOptionsBeDisabled() {
    let areFolderOptionsDisabled = false
    let areFileOptionsDisabled = false

    if (selectedFolderPath && !selectedFilePath) {
      areFileOptionsDisabled = true
      areFolderOptionsDisabled = false
    } else {
      areFileOptionsDisabled = false
      areFolderOptionsDisabled = true
    }

    return [areFileOptionsDisabled, areFolderOptionsDisabled]
  }

  function handleDeleteFolder() {
    if (editorSocket && selectedFolderPath) {
      editorSocket?.emit('delete-folder', {
        folderPath: selectedFolderPath,
        projectId,
      })
    }
  }

  function handleDeleteFile() {
    if (editorSocket && selectedFilePath) {
      editorSocket?.emit('delete-file', {
        filePath: selectedFilePath,
        projectId,
      })
    }
  }

  function handleCreateFolder() {
    setNewEntry({ ...newEntry, addNewFolder: true, addNewFile: false })
  }

  function handleCreateFile() {
    setNewEntry({ ...newEntry, addNewFile: true, addNewFolder: false })
  }

  function handleRenameFolder() {
    // Fetching the initial folder name that needs to be displayed inside the input
    let folderName =
      selectedFolderPath.split('/')[selectedFolderPath.split('/').length - 1]
    setRenameFileOrFolder({
      ...renameFileOrFolder,
      renameFile: '',
      renameFolder: folderName,
      fileOrFolderPath: selectedFolderPath,
    })
  }

  function handleRenameFile() {
    // Fetching the initial file name that needs to be displayed inside the input
    let fileName =
      selectedFilePath.split('/')[selectedFilePath.split('/').length - 1]
    setRenameFileOrFolder({
      ...renameFileOrFolder,
      renameFile: fileName,
      renameFolder: '',
      fileOrFolderPath: selectedFilePath,
    })
  }

  return (
    <ul
      className="menu bg-base-100 rounded-box w-56 absolute shadow-lg z-50"
      style={{ top: `${yCoord}px`, left: `${xCoord}px` }}
    >
      <li onClick={handleCreateFolder}>
        <button
          className={`flex items-center gap-1.5 w-full px-2 py-0.75 rounded text-sm text-base-content transition-colors duration-100 text-left
          ${
            shouldFile_FolderOptionsBeDisabled()[1]
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-base-300 cursor-pointer'
          }`}
          disabled={shouldFile_FolderOptionsBeDisabled()[1]}
        >
          <span className="truncate">Create Folder</span>
        </button>
      </li>
      <li onClick={handleCreateFile}>
        <button
          className={`flex items-center gap-1.5 w-full px-2 py-0.75 rounded text-sm text-base-content transition-colors duration-100 text-left
          ${
            shouldFile_FolderOptionsBeDisabled()[1]
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-base-300 cursor-pointer'
          }`}
          disabled={shouldFile_FolderOptionsBeDisabled()[1]}
        >
          <span className="truncate">Create File</span>
        </button>
      </li>
      <li onClick={handleDeleteFolder}>
        <button
          className={`flex items-center gap-1.5 w-full px-2 py-0.75 rounded text-sm text-base-content transition-colors duration-100 text-left
          ${
            shouldFile_FolderOptionsBeDisabled()[1]
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-base-300 cursor-pointer'
          }`}
          disabled={shouldFile_FolderOptionsBeDisabled()[1]}
        >
          <span className="truncate">Delete Folder</span>
        </button>
      </li>
      <li onClick={handleDeleteFile}>
        <button
          className={`flex items-center gap-1.5 w-full px-2 py-0.75 rounded text-sm text-base-content transition-colors duration-100 text-left
          ${
            shouldFile_FolderOptionsBeDisabled()[0]
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-base-300 cursor-pointer'
          }`}
          disabled={shouldFile_FolderOptionsBeDisabled()[0]}
        >
          <span className="truncate">Delete File</span>
        </button>
      </li>
      <li onClick={handleRenameFolder}>
        <button
          className={`flex items-center gap-1.5 w-full px-2 py-0.75 rounded text-sm text-base-content transition-colors duration-100 text-left
          ${
            shouldFile_FolderOptionsBeDisabled()[1]
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-base-300 cursor-pointer'
          }`}
          disabled={shouldFile_FolderOptionsBeDisabled()[1]}
        >
          <span className="truncate">Rename Folder</span>
        </button>
      </li>
      <li onClick={handleRenameFile}>
        <button
          className={`flex items-center gap-1.5 w-full px-2 py-0.75 rounded text-sm text-base-content transition-colors duration-100 text-left
          ${
            shouldFile_FolderOptionsBeDisabled()[0]
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-base-300 cursor-pointer'
          }`}
          disabled={shouldFile_FolderOptionsBeDisabled()[0]}
        >
          <span className="truncate">Rename File</span>
        </button>
      </li>
    </ul>
  )
}
export default ContextMenu
