import { useRef, useEffect } from 'react'
import { IoReloadSharp } from 'react-icons/io5'
import { useParams } from 'react-router'
import useEditorSocketStore from '../../../store/useEditorSocketStore'
import { usePortStore } from '../../../store/usePortStore'
import Loader from '../../Shared/Loader'

function WebBrowser() {
  const browserRef = useRef(null)

  const { projectId } = useParams()
  const { editorSocket } = useEditorSocketStore()

  const { ports, projectTypeIdentification } = usePortStore()

  useEffect(() => {
    if (!editorSocket) return

    editorSocket.emit('fetch-port', {
      projectId,
    })
  }, [editorSocket, ports])

  let port = null
  if (projectTypeIdentification != null) {
    if (projectTypeIdentification == 'react') {
      port = ports.react
    } else {
      port = ports.express
    }
  }

  if (!port) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader message="Loading browser..." />
      </div>
    )
  }

  const url = `http://${window.location.hostname}:${port}`

  function handleRefresh() {
    if (browserRef.current) {
      browserRef.current.src = url
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="input flex items-center gap-2 w-full">
        <IoReloadSharp
          onClick={handleRefresh}
          style={{ cursor: 'pointer' }}
          title="Refresh"
        />

        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 bg-transparent outline-none"
        />
      </div>

      <iframe
        ref={browserRef}
        src={url}
        style={{ width: '100%', height: '95vh', border: 'none' }}
      />
    </div>
  )
}

export default WebBrowser
