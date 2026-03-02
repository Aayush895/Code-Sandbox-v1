// import { useState } from 'react'
import { FileIcon } from '../../Shared/FileIcon'
import { FolderIcon } from '../../Shared/FolderIcon'
function ProjectFolder({ rootDirectory, isRoot = false }) {
  console.log('LOGGING ROOT: ', rootDirectory)

  /**
   * If building our own custom folder structure then this is the logic for handling if the folder is open or closed
   */

  // function handleFolderVisibility(folder) {
  //   setFolderVisibility({
  //     ...folderVisibility,
  //     [folder?.name]: !folderVisibility[folder?.name],
  //   })
  // }

  return (
    rootDirectory && (
      <ul
        className={
          isRoot
            ? 'menu bg-base-200 h-screen w-64 p-2 overflow-y-auto'
            : 'menu w-full'
        }
      >
        <li>
          <details>
            <summary className="flex items-center gap-2 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-300 rounded-md px-2 py-1">
              <FolderIcon isOpen={false} />
              <span className="truncate">{rootDirectory.name}</span>
            </summary>
            <ul className="pl-3 border-l border-base-300 ml-3">
              {rootDirectory.children?.map((childNode, idx) =>
                childNode.children ? (
                  <ProjectFolder
                    rootDirectory={childNode}
                    key={`${childNode.name}-${idx}`}
                  />
                ) : (
                  <li key={`${childNode.name}-${idx}`}>
                    <button className="flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content hover:bg-base-300 rounded-md px-2 py-1 w-full">
                      <FileIcon name={childNode.name} />
                      <span className="truncate">{childNode.name}</span>
                    </button>
                  </li>
                ),
              )}
            </ul>
          </details>
        </li>
      </ul>
    )
  )
}
export default ProjectFolder
