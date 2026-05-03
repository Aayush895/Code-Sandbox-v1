import { useEffect, useRef } from 'react'
import { IoReloadSharp } from 'react-icons/io5'
import { useParams } from 'react-router'
import useEditorSocketStore from '../../../store/useEditorSocketStore'
import { usePortStore } from '../../../store/usePortStore'

function WebBrowser() {
  const browserRef = useRef(null)
  const { port } = usePortStore()
  const { editorSocket } = useEditorSocketStore()
  const { projectId } = useParams()

  useEffect(() => {
    if (!port && editorSocket) {
      editorSocket.emit('fetch-port', {
        containerName: `code-sandbox-v1-${projectId}`,
      })
    }
  }, [editorSocket, port])

  if (!port) {
    return <span className="loading loading-spinner loading-xl"></span>
  }

  function handleRefresh() {
    if (browserRef.current) {
      const oldAddr = browserRef.current.src
      browserRef.current.src = oldAddr
    }
  }

  return (
    <div>
      <label className="input validator">
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
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </g>
        </svg>
        <IoReloadSharp onClick={handleRefresh} className="pointer" />
        <input
          type="url"
          required
          placeholder="https://"
          defaultValue={`http://${window.location.hostname}:${port}`}
          pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
          title="Must be valid URL"
        />
      </label>
      <p className="validator-hint">Must be valid URL</p>
      <iframe
        key={`http://${window.location.hostname}:${port}`}
        ref={browserRef}
        src={`http://${window.location.hostname}:${port}`}
        style={{
          width: '100%',
          height: '95vh',
          border: 'none',
        }}
      />
    </div>
  )
}
export default WebBrowser
