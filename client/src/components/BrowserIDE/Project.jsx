/* eslint-disable react-hooks/exhaustive-deps */
import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { io } from 'socket.io-client'
import useFetchProjectStrcture from '../../Hooks/queries/useFetchProjectStructure'
import useContextMenuStore from '../../store/useContextMenuStore'
import useEditorSocketStore from '../../store/useEditorSocketStore'
import ContextMenu from '../Shared/ContextMenu'
import Dialog from '../Shared/Dialog'
import Loader from '../Shared/Loader'
import Toast from '../Shared/Toast'
import BrowserEditor from './Editor/BrowserEditor'
import ProjectFolder from './FolderStructure/ProjectFolder'
import WebBrowser from './WebBrowser/WebBrowser'
import WebTerminal from './WebTerminal/WebTerminal'

function Project() {
  const { projectId } = useParams()
  const { projectStructure, isPending, isError, error } =
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
    if (!isPending) {
      const socket = io(`${import.meta.env.VITE_BASE_URL}/editor`, {
        query: {
          projectId,
        },
      })
      setEditorSocket(socket)

      return () => {
        socket.disconnect()
      }
    }
  }, [isPending])

  if (isError) {
    return (
      <Dialog
        title={'Error'}
        content={error?.response?.data?.message || 'Something went wrong'}
      />
    )
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: '#1e1e1e',
      }}
      onClick={handleHideContextMenu}
    >
      <Toast />
      {isPending ? (
        <Loader fullScreen={true} message="Loading project..." />
      ) : (
        <>
          <Allotment defaultSizes={[20, 60, 20]}>
            <Allotment.Pane minSize={200} preferredSize={260}>
              <div
                style={{
                  height: '100%',
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
            </Allotment.Pane>

            <Allotment.Pane minSize={400}>
              <Allotment vertical defaultSizes={[75, 25]}>
                <Allotment.Pane minSize={200}>
                  <div
                    style={{
                      height: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <BrowserEditor
                      activeFilesArr={activeFilesArr}
                      setActiveFilesArr={setActiveFilesArr}
                      fileExtension={fileExtension}
                      setFileExtension={setFileExtension}
                    />
                  </div>
                </Allotment.Pane>

                <Allotment.Pane minSize={120} maxSize={350} preferredSize={220}>
                  <div
                    style={{
                      height: '100%',
                      borderTop: '1px solid #333',
                    }}
                  >
                    <WebTerminal />
                  </div>
                </Allotment.Pane>
              </Allotment>
            </Allotment.Pane>

            <Allotment.Pane minSize={300} preferredSize={450}>
              <div
                style={{
                  height: '100%',
                  borderLeft: '1px solid #333',
                  overflow: 'hidden',
                }}
              >
                <WebBrowser />
              </div>
            </Allotment.Pane>
          </Allotment>

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
