import { useEffect } from 'react'
import { io } from 'socket.io-client'
import useFetchProjectStrcture from '../../Hooks/queries/useFetchProjectStructure'
import useEditorSocketStore from '../../store/useEditorSocketStore'
import useProjectStore from '../../store/useProjectStore'
import Dialog from '../Shared/Dialog'
import Loader from '../Shared/Loader'
import BrowserEditor from './Editor/BrowserEditor'
import ProjectFolder from './FolderStructure/ProjectFolder'

function Project() {
  const { projectName } = useProjectStore()
  const { projectStructure, isPending, isError } =
    useFetchProjectStrcture(projectName)

  const { setEditorSocket } = useEditorSocketStore()
  console.log('LOGGING TREE: ', projectStructure?.projectTree)
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
    <div style={{ height: '100vh', display: 'flex' }}>
      {isPending ? (
        <Loader fullScreen={true} />
      ) : (
        <>
          <div
            style={{
              width: '260px',
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
        </>
      )}
    </div>
  )
}
export default Project
