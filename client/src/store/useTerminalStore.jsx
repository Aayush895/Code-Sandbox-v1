import { create } from 'zustand'

export const useTerminalStore = create((set) => ({
  terminalSocket: null,
  setTerminalSocket: (incomingSocket) => {
    set({
      terminalSocket: incomingSocket,
    })
  },
}))
