import { useRef, useEffect } from 'react'
import { IoReloadSharp } from 'react-icons/io5'
import { useParams } from 'react-router'
import useEditorSocketStore from '../../../store/useEditorSocketStore'
import { usePortStore } from '../../../store/usePortStore'

function WebBrowser() {
  const browserRef = useRef(null)

  const { projectId } = useParams()
  const { editorSocket } = useEditorSocketStore()

  const { ports, activePreview, setActivePreview } = usePortStore()

  useEffect(() => {
    if (!editorSocket) return

    if (!ports?.vite && !ports?.express) {
      editorSocket.emit('fetch-port', {
        projectId,
      })
    }
  }, [editorSocket, projectId, ports])

  const port =
    activePreview === 'express' ? ports?.express : ports?.vite || ports?.express

  if (!port) {
    return <span className="loading loading-spinner loading-xl"></span>
  }

  const url = `http://${window.location.hostname}:${port}`

  function handleRefresh() {
    if (browserRef.current) {
      browserRef.current.src = url
    }
  }

  return (
    <div>
      {ports?.vite && ports?.express && (
        <div className="flex gap-2 mb-2">
          <button
            className={`btn btn-sm ${
              activePreview === 'vite' ? 'btn-primary' : 'btn-ghost'
            }`}
            onClick={() => setActivePreview('vite')}
          >
            Frontend
          </button>

          <button
            className={`btn btn-sm ${
              activePreview === 'express' ? 'btn-primary' : 'btn-ghost'
            }`}
            onClick={() => setActivePreview('express')}
          >
            Backend
          </button>
        </div>
      )}

      <div className="input flex items-center gap-2">
        <IoReloadSharp
          onClick={handleRefresh}
          style={{ cursor: 'pointer' }}
          title="Refresh"
        />

        <input
          type="text"
          value={url}
          readOnly
          className="w-full bg-transparent outline-none"
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
