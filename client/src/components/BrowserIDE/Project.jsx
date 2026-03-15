import { useEffect } from 'react'
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
            />
          </div>
          <BrowserEditor />
          {showContextMenu && <ContextMenu xCoord={xCoord} yCoord={yCoord} />}
        </>
      )}
    </div>
  )
}
export default Project
