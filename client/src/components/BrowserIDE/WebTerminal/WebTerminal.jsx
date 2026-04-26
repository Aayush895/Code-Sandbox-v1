import { AttachAddon } from '@xterm/addon-attach'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import { useRef, useEffect } from 'react'
import '@xterm/xterm/css/xterm.css'
import { useParams } from 'react-router'
import { useTerminalStore } from '../../../store/useTerminalStore'

function WebTerminal() {
  const terminalRef = useRef(null)
  const { projectId } = useParams()
  const { setTerminalSocket } = useTerminalStore()

  useEffect(() => {
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
    fitAddOn.fit()

    const ws = new WebSocket(
      `${import.meta.env.VITE_TERMINAL_SOCKET_URL}?projectId=${projectId}`,
    )

    setTerminalSocket(ws)

    ws.onopen = () => {
      const attachAddon = new AttachAddon(ws)
      terminalInstance.loadAddon(attachAddon)
    }

    return () => {
      terminalInstance.dispose()
      ws.close()
    }
  }, [])

  return <div ref={terminalRef} className="terminal h-[25vh] overflow-auto" />
}
export default WebTerminal
