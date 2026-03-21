import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useContextMenuStore = create(
  devtools((set) => ({
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
    selectedFolderPath: null,
    setSelectedFolderPath: (incomingFolderPath) => {
      set({ selectedFolderPath: incomingFolderPath })
    },
    selectedFilePath: null,
    setSelectedFilePath: (incomingFilePath) => {
      set({ selectedFilePath: incomingFilePath })
    },
    newFolderName: null,
    setNewFolderName: (incomingFolderName) => {
      set({ newFolderName: incomingFolderName })
    },
  })),
)

export default useContextMenuStore
