/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { io } from 'socket.io-client'
import useFetchProjectStrcture from '../../Hooks/queries/useFetchProjectStructure'
import useContextMenuStore from '../../store/useContextMenuStore'
import useEditorSocketStore from '../../store/useEditorSocketStore'
import ContextMenu from '../Shared/ContextMenu'
import Dialog from '../Shared/Dialog'
import Loader from '../Shared/Loader'
import BrowserEditor from './Editor/BrowserEditor'
import ProjectFolder from './FolderStructure/ProjectFolder'
import WebTerminal from './WebTerminal/WebTerminal'

function Project() {
  const { projectId } = useParams()
  const { projectStructure, isPending, isError } =
    useFetchProjectStrcture(projectId)

  const { setEditorSocket } = useEditorSocketStore()

  const {
    xCoord,
    yCoord,
    showContextMenu,
    setShowContextMenu,
    setYCoord,
    setXCoord,
  } = useContextMenuStore()

  const [newEntry, setNewEntry] = useState({
    addNewFile: false,
    addNewFolder: false,
    filePath: null,
  })

  const [renameFileOrFolder, setRenameFileOrFolder] = useState({
    renameFile: '',
    renameFolder: '',
    fileOrFolderPath: null,
  })

  const [activeFilesArr, setActiveFilesArr] = useState([])

  const [fileExtension, setFileExtension] = useState('')

  function handleHideContextMenu() {
    setShowContextMenu(false)
    setYCoord(0)
    setXCoord(0)
  }

  useEffect(() => {
    if (isPending == false) {
      const socket = io(`${import.meta.env.VITE_BASE_URL}/editor`)
      setEditorSocket(socket)
    }
  }, [isPending])

  if (isError) {
    return <Dialog title={'Error'} content={'Error in project creation'} />
  }

  return (
    <div
      style={{ height: '100vh', display: 'flex' }}
      onClick={handleHideContextMenu}
    >
      {isPending ? (
        <Loader fullScreen={true} />
      ) : (
        <>
          <div
            style={{
              width: '20%',
              overflowY: 'auto',
              borderRight: '1px solid #333',
              background: '#1e1e1e',
            }}
          >
            <ProjectFolder
              rootDirectory={projectStructure?.projectTree}
              isRoot={true}
              newEntry={newEntry}
              setNewEntry={setNewEntry}
              renameFileOrFolder={renameFileOrFolder}
              setRenameFileOrFolder={setRenameFileOrFolder}
              activeFilesArr={activeFilesArr}
              setActiveFilesArr={setActiveFilesArr}
              setFileExtension={setFileExtension}
            />
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{
              width: '80%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Editor */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <BrowserEditor
                activeFilesArr={activeFilesArr}
                setActiveFilesArr={setActiveFilesArr}
                fileExtension={fileExtension}
                setFileExtension={setFileExtension}
              />
            </div>

            {/* Terminal at bottom */}
            <WebTerminal />
          </div>
          {showContextMenu && (
            <ContextMenu
              xCoord={xCoord}
              yCoord={yCoord}
              newEntry={newEntry}
              setNewEntry={setNewEntry}
              renameFileOrFolder={renameFileOrFolder}
              setRenameFileOrFolder={setRenameFileOrFolder}
            />
          )}
        </>
      )}
    </div>
  )
}
export default Project
