import { useMutation } from '@tanstack/react-query'
import { createProject } from '../../Apis/projectApis'

function useCreateProject() {
  const { isPending, isError, mutateAsync } = useMutation({
    mutationFn: (projectName) => createProject(projectName),
    onSuccess: (data) => console.log('LOGGING DATA: ', data),
  })

  return { createProjectMutation: mutateAsync, isProjectLoading: isPending, isError }
}

export default useCreateProject
