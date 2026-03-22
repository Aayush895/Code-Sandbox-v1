import { useParams } from 'react-router'
import useContextMenuStore from '../../store/useContextMenuStore'
import useEditorSocketStore from '../../store/useEditorSocketStore'
function ContextMenu({ xCoord, yCoord, newEntry, setNewEntry }) {
  const { editorSocket } = useEditorSocketStore()
  const { selectedFolderPath, selectedFilePath } = useContextMenuStore()

  const { projectId } = useParams()
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

  function handleRenameFolder() {}

  function handleRenameFile() {}

  return (
    <ul
      className="menu bg-base-100 rounded-box w-56 absolute shadow-lg z-50"
      style={{ top: `${yCoord}px`, left: `${xCoord}px` }}
    >
      <li onClick={handleCreateFolder}>
        <p>Create Folder</p>
      </li>
      <li onClick={handleCreateFile}>
        <p>Create File</p>
      </li>
      <li onClick={handleDeleteFolder}>
        <p>Delete Folder</p>
      </li>
      <li onClick={handleDeleteFile}>
        <p>Delete File</p>
      </li>
      <li onClick={handleRenameFolder}>
        <p>Rename Folder</p>
      </li>
      <li onClick={handleRenameFile}>
        <p>Rename File</p>
      </li>
    </ul>
  )
}
export default ContextMenu
