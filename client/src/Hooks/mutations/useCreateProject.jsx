import { useMutation } from '@tanstack/react-query'
import { createProject } from '../../Apis/projectApis'
import useProjectStore from '../../store/useProjectStore'

function useCreateProject() {
  const { setProjectId } = useProjectStore()
  const { isPending, isError, mutateAsync } = useMutation({
    mutationFn: (projectName) => createProject(projectName),
    onSuccess: (data) => {
      console.log('LOGGING DATA: ', data?.id)
      setProjectId(data?.id)
    },
  })

  return {
    createProjectMutation: mutateAsync,
    isProjectLoading: isPending,
    isError,
  }
}

export default useCreateProject
