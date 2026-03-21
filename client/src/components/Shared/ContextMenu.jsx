import { useParams } from 'react-router'
import useContextMenuStore from '../../store/useContextMenuStore'
import useEditorSocketStore from '../../store/useEditorSocketStore'
function ContextMenu({ xCoord, yCoord }) {
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

  return (
    <ul
      className="menu bg-base-100 rounded-box w-56 absolute shadow-lg z-50"
      style={{ top: `${yCoord}px`, left: `${xCoord}px` }}
    >
      <li>
        <p>Create Folder</p>
      </li>
      <li>
        <p>Create File</p>
      </li>
      <li onClick={handleDeleteFolder}>
        <p>Delete Folder</p>
      </li>
      <li onClick={handleDeleteFile}>
        <p>Delete File</p>
      </li>
      <li>
        <p>Rename Folder</p>
      </li>
      <li>
        <p>Rename File</p>
      </li>
    </ul>
  )
}
export default ContextMenu
