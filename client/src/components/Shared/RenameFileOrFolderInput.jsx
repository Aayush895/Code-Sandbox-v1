import { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useEditorSocketStore from '../../store/useEditorSocketStore'

function RenameFileOrFolderInput({
  renameFileOrFolder,
  setRenameFileOrFolder,
}) {
  const [renamedFileOrFolder, setRenamedFileOrFolder] = useState(
    renameFileOrFolder?.renameFile
      ? renameFileOrFolder?.renameFile
      : renameFileOrFolder?.renameFolder,
  )
  const renameInputRef = useRef(null)
  const { editorSocket } = useEditorSocketStore()
  const { projectId } = useParams()

  useEffect(() => {
    renameInputRef.current?.focus()
    renameInputRef.current?.select()
  }, [])

  function handleRenameFileOrFolder(e) {
    e.preventDefault()
    // Check if we are renaming a folder or a file
    setRenamedFileOrFolder(e.target.value)
  }

  function handleRenameInputBlur() {
    if (renamedFileOrFolder) {
      emitRenameFileOrFolderEvent()
    }
    setRenameFileOrFolder({
      ...renameFileOrFolder,
      renameFile: '',
      renameFolder: '',
      fileOrFolderPath: null,
    })
  }

  function handleRenameFileOrFolderEvent(e) {
    if (editorSocket && e.key == 'Enter') {
      emitRenameFileOrFolderEvent()
      setRenamedFileOrFolder('')
    }
  }

  function emitRenameFileOrFolderEvent() {
    if (renameFileOrFolder?.renameFile) {
      editorSocket.emit('rename-file', {
        filePath: renameFileOrFolder?.fileOrFolderPath,
        newFileName: renamedFileOrFolder,
        projectId,
      })
    } else {
      editorSocket?.emit('rename-folder', {
        folderPath: renameFileOrFolder?.fileOrFolderPath,
        newFolderName: renamedFileOrFolder,
        projectId,
      })
    }
  }

  return (
    <input
      placeholder="Please provide a name for the folder"
      value={renamedFileOrFolder}
      onChange={handleRenameFileOrFolder}
      onKeyDown={handleRenameFileOrFolderEvent}
      onBlur={handleRenameInputBlur}
      ref={renameInputRef}
      className="bg-gray-700"
    />
  )
}
export default RenameFileOrFolderInput
