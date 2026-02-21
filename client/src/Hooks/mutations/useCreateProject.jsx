import { useMutation } from '@tanstack/react-query'
import { createProject } from '../../Apis/projectApis'

function useCreateProject() {
  const { mutate } = useMutation({
    mutationFn: (projectName) => createProject(projectName),
    onSuccess: (data) => console.log('LOGGING DATA: ', data),
  })

  return { createProjectMutation: mutate }
}

export default useCreateProject
