import { useState } from 'react'
import { useParams } from 'react-router'
import useContextMenuStore from '../../../store/useContextMenuStore'
import useEditorSocketStore from '../../../store/useEditorSocketStore'
import { FileIcon } from '../../Shared/FileIcon'
import { FolderIcon } from '../../Shared/FolderIcon'

function ProjectFolder({ rootDirectory, isRoot = false }) {
  const { editorSocket } = useEditorSocketStore()
  const { projectId } = useParams()
  const {
    setShowContextMenu,
    setYCoord,
    setXCoord,
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

  function handleContextMenu(e) {
    e.preventDefault()
    setShowContextMenu(true)
    setXCoord(e.pageX)
    setYCoord(e.pageY)
  }

  return (
    <>
      {rootDirectory && (
        <ul
          className={
            isRoot
              ? 'menu menu-dropdown-toggle bg-base-200 h-screen w-full p-2 overflow-y-auto'
              : 'menu menu-dropdown-toggle w-full'
          }
        >
          <li>
            <button
              className="flex items-center gap-2 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-300 rounded-md px-2 py-1 w-full menu-dropdown-toggle"
              onClick={() => handleFolderVisibility(rootDirectory)}
              onContextMenu={handleContextMenu}
            >
              <FolderIcon isOpen={!!folderVisibility[rootDirectory.name]} />
              <span className="truncate">{rootDirectory.name}</span>
            </button>

            {/* Only render children when folder is open */}
            {folderVisibility[rootDirectory.name] && (
              <ul className="pl-3 border-l border-base-300 ml-3 menu-dropdown menu-dropdown-show">
                {rootDirectory.children?.map((childNode, idx) =>
                  childNode.children ? (
                    <ProjectFolder
                      rootDirectory={childNode}
                      key={`${childNode.name}-${idx}`}
                    />
                  ) : (
                    <li
                      key={`${childNode.name}-${idx}`}
                      onDoubleClick={() =>
                        handleShowFileContents(rootDirectory, childNode.name)
                      }
                      onContextMenu={handleContextMenu}
                    >
                      <button className="flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content hover:bg-base-300 rounded-md px-2 py-1 w-full">
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
