import { create } from 'zustand'

const useContextMenuStore = create((set) => ({
  xCoord: 0,
  setXCoord: (incomingCoordinate) => {
    set({ xCoord: incomingCoordinate })
  },
  yCoord: 0,
  setYCoord: (incomingCoordinate) => {
    set({ yCoord: incomingCoordinate })
  },
  showContextMenu: false,
  setShowContextMenu: (showHideContextMenu) => {
    set({ showContextMenu: showHideContextMenu })
  },
}))

export default useContextMenuStore
