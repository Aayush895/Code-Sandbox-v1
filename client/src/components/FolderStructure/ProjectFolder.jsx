import { useState } from 'react'

function ProjectFolder({ rootDirectory }) {
  const [folderVisibility, setFolderVisibility] = useState({})
  console.log('LOGGING ROOT: ', rootDirectory, folderVisibility)

  function handleFolderVisibility(folder) {
    setFolderVisibility({
      ...folderVisibility,
      [folder?.name]: !folderVisibility[folder?.name],
    })
  }

  return (
    rootDirectory && (
      <>
        <h1
          className="text-2xl text-gray-400"
          onClick={() => handleFolderVisibility(rootDirectory)}
        >
          {rootDirectory?.name}
        </h1>
        {folderVisibility[rootDirectory?.name] &&
          rootDirectory?.children?.map((childNode, idx) => {
            return folderVisibility[rootDirectory?.name] &&
              childNode?.children ? (
              <ProjectFolder
                rootDirectory={childNode}
                key={`${childNode?.name} - ${idx}`}
              />
            ) : (
              <p>{childNode?.name}</p>
            )
          })}
      </>
    )
  )
}
export default ProjectFolder
