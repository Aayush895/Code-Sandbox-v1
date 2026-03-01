import useFetchProjectStrcture from '../../Hooks/queries/useFetchProjectStructure'
import useProjectStore from '../../store/useProjectStore'
import ProjectFolder from '../FolderStructure/ProjectFolder'
import Dialog from '../Shared/Dialog'
import Loader from '../Shared/Loader'

function Project() {
  const { projectName } = useProjectStore()
  const { projectStructure, isPending, isError } =
    useFetchProjectStrcture(projectName)

  if (isError) {
    return <Dialog title={'Error'} content={'Error in project creation'} />
  }

  console.log('LOGGING TREE: ', projectStructure)

  return (
    <div>
      {isPending ? (
        <Loader fullScreen={true} />
      ) : (
        <ProjectFolder rootDirectory={projectStructure?.projectTree} />
      )}
    </div>
  )
}
export default Project
