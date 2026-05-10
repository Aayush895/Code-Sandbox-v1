import { AttachAddon } from '@xterm/addon-attach'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import { useRef, useEffect } from 'react'
import '@xterm/xterm/css/xterm.css'
import { useParams } from 'react-router'
import { useTerminalStore } from '../../../store/useTerminalStore'

function WebTerminal() {
  const terminalRef = useRef(null)
  const startedRef = useRef(false)
  const { projectId } = useParams()
  const { setTerminalSocket } = useTerminalStore()

  useEffect(() => {
    if (startedRef.current) return
    if (!terminalRef.current) return

    startedRef.current = true
    const terminalInstance = new Terminal({
      cursorBlink: true,
      cursorWidth: '15px',
      cursorStyle: 'block',
      fontSize: 16,
      fontFamily: 'Fira Code',
      convertEol: true,
      theme: {
        background: '#282a37',
        foreground: '#f8f8f3',
        cursor: '#f8f8f3',
        cursorAccent: '#282a37',
        red: '#ff5544',
        green: '#50fa7c',
        yellow: '#f1fa8c',
        cyan: '#8be9fd',
      },
    })
    const fitAddOn = new FitAddon()
    terminalInstance.loadAddon(fitAddOn)
    terminalInstance.open(terminalRef.current)
    setTimeout(() => {
      fitAddOn.fit()
    }, 0)

    const resizeObserver = new ResizeObserver(() => {
      fitAddOn.fit()
    })
    resizeObserver.observe(terminalRef.current)

    const ws = new WebSocket(
      `${import.meta.env.VITE_TERMINAL_SOCKET_URL}?projectId=${projectId}`,
    )

    setTerminalSocket(ws)

    ws.onopen = () => {
      const attachAddon = new AttachAddon(ws)
      terminalInstance.loadAddon(attachAddon)
    }

    return () => {
      startedRef.current = false
      resizeObserver.disconnect()
      terminalInstance.dispose()
      ws.close()
    }
  }, [])

  return (
  <div
    ref={terminalRef}
    className="terminal w-full h-full"
    style={{ overflow: 'hidden', height: '100%' }}
  />
)
}
export default WebTerminal
