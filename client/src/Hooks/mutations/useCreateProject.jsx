import { useMutation } from '@tanstack/react-query'
import { createProject } from '../../Apis/projectApis'
import ErrorAlert from '../../components/Shared/ErrorAlert'
import SuccessAlert from '../../components/Shared/SuccessAlert'

function useCreateProject() {
  const { mutate } = useMutation({
    mutationFn: (projectName) => createProject(projectName),
    onError: () => <ErrorAlert reason="Something went wrong!" />,
    onSuccess: (data) => <SuccessAlert reason={data?.message} />,
  })

  return { createProjectMutation: mutate }
}

export default useCreateProject
