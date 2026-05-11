import { useMutation } from '@tanstack/react-query'
import { createProject } from '../../Apis/projectApis'

function useCreateProject() {
  const { isPending, isError, mutateAsync } = useMutation({
    mutationFn: (project) => createProject(project),
  })

  return {
    createProjectMutation: mutateAsync,
    isProjectLoading: isPending,
    isError,
  }
}

export default useCreateProject
