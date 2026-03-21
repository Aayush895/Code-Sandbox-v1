import { useState } from 'react'
import { useParams } from 'react-router'
import useContextMenuStore from '../../../store/useContextMenuStore'
import useEditorSocketStore from '../../../store/useEditorSocketStore'
import AddNewFileOrFolderInput from '../../Shared/AddNewFileOrFolderInput'
import { FileIcon } from '../../Shared/FileIcon'
import { FolderIcon } from '../../Shared/FolderIcon'

function ProjectFolder({
  rootDirectory,
  isRoot = false,
  addNewFolder,
  setAddNewFolder,
}) {
  const { editorSocket } = useEditorSocketStore()
  const { projectId } = useParams()
  const {
    setShowContextMenu,
    setYCoord,
    setXCoord,
    setSelectedFolderPath,
    setSelectedFilePath,
  } = useContextMenuStore()
  const [folderVisibility, setFolderVisibility] = useState({})

  function handleFolderVisibility(folder) {
    setFolderVisibility({
      ...folderVisibility,
      [folder?.name]: !folderVisibility[folder?.name],
    })
  }

  // Below function parses the file and shows the contents of the file on the editor
  function handleShowFileContents(rootDirectory, fileName) {
    if (editorSocket) {
      const filePath = `${rootDirectory?.path}/${fileName}`
      const roomId = `${projectId}/${fileName}`
      editorSocket.emit('read-file', { filePath })

      // After the client emits read-file and the contents are displayed, make the client join the room
      editorSocket.emit('join-room', { roomId })
    }
  }

  function handleContextMenu(e, rootDirectory, fileName = null) {
    e.preventDefault()
    setShowContextMenu(true)
    setXCoord(e.pageX)
    setYCoord(e.pageY)
    if (rootDirectory && !fileName) {
      setSelectedFolderPath(rootDirectory?.path)
    } else {
      const filePath = `${rootDirectory?.path}/${fileName}`
      setSelectedFilePath(filePath)
    }
  }

  return (
    <>
      {rootDirectory && (
        <ul
          className={
            isRoot
              ? 'w-full h-screen bg-base-200 overflow-y-auto p-2 select-none'
              : 'w-full select-none'
          }
        >
          <li className="list-none">
            {/* Folder toggle button */}
            <button
              className="flex items-center gap-1.5 w-full px-2 py-0.75 rounded text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-300 transition-colors duration-100 text-left"
              onClick={() => handleFolderVisibility(rootDirectory)}
              onContextMenu={(e) => handleContextMenu(e, rootDirectory)}
            >
              <FolderIcon isOpen={!!folderVisibility[rootDirectory.name]} />
              <span className="truncate">{rootDirectory.name}</span>
            </button>

            {/* Children: rendered when folder is open */}
            {folderVisibility[rootDirectory.name] && (
              <ul className="pl-3 ml-2.25 border-l border-base-300 mt-0.5 space-y-0.5">
                {/* Input appears INSIDE the open folder, before other children */}
                {addNewFolder && (
                  <li className="list-none px-1 py-0.5">
                    <AddNewFileOrFolderInput
                      setAddNewFolder={setAddNewFolder}
                    />
                  </li>
                )}

                {rootDirectory.children?.map((childNode, idx) =>
                  childNode.children ? (
                    // Sub-folder — recursive, no extra indent wrapper needed
                    <li key={`${childNode.name}-${idx}`} className="list-none">
                      <ProjectFolder
                        rootDirectory={childNode}
                        key={`${childNode.name}-${idx}`}
                      />
                    </li>
                  ) : (
                    // File row — aligned with folder rows via the same px-2 py-[3px]
                    <li
                      key={`${childNode.name}-${idx}`}
                      className="list-none"
                      onDoubleClick={() =>
                        handleShowFileContents(rootDirectory, childNode.name)
                      }
                      onContextMenu={(e) =>
                        handleContextMenu(e, rootDirectory, childNode.name)
                      }
                    >
                      <button className="flex items-center gap-1.5 w-full px-2 py-0.75 rounded text-sm text-base-content/60 hover:text-base-content hover:bg-base-300 transition-colors duration-100 text-left">
                        <FileIcon name={childNode.name} />
                        <span className="truncate">{childNode.name}</span>
                      </button>
                    </li>
                  ),
                )}
              </ul>
            )}
          </li>
        </ul>
      )}
    </>
  )
}

export default ProjectFolder
