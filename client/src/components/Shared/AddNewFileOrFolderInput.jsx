import { useState } from 'react'
import { useParams } from 'react-router'
import useContextMenuStore from '../../store/useContextMenuStore'
import useEditorSocketStore from '../../store/useEditorSocketStore'

function AddNewFileOrFolderInput({ setAddNewFolder }) {
  const [fileOrFolderName, setFileorFolderName] = useState('')
  const { projectId } = useParams()
  const { editorSocket } = useEditorSocketStore()
  const { selectedFolderPath } = useContextMenuStore()

  function handleNewFileOrFolderName(e) {
    e.preventDefault()
    setFileorFolderName(e.target.value)
  }

  function handleAddNewFileOrFolder(e) {
    if (e.keyCode == 13) {
      console.log(fileOrFolderName)
      setAddNewFolder(false)
      editorSocket?.emit('create-folder', {
        folderPath: selectedFolderPath,
        projectId,
        newFolderName: fileOrFolderName,
      })
    }
  }

  return (
    <label className="input">
      <svg
        className="h-[1em] opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
        </g>
      </svg>
      <input
        type="text"
        className="grow"
        placeholder="index.jsx"
        value={fileOrFolderName}
        onChange={handleNewFileOrFolderName}
        onKeyDown={handleAddNewFileOrFolder}
      />
    </label>
  )
}
export default AddNewFileOrFolderInput
