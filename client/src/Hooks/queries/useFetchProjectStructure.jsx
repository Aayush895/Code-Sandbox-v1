/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { fetchProjectTree } from '../../Apis/projectApis'
import useProjectStore from '../../store/useProjectStore'

function useFetchProjectStrcture(incomingProjectName) {
  const { projectName, projectStructure, setProjectStructure } =
    useProjectStore()
  const {
    isPending,
    isError,
    data: fetchedProjectTreeData,
  } = useQuery({
    queryKey: ['projectTree', incomingProjectName],
    queryFn: async () => await fetchProjectTree(incomingProjectName),
  })

  useEffect(() => {
    if (fetchedProjectTreeData && projectName) {
      setProjectStructure(fetchedProjectTreeData)
    }
  }, [projectName, fetchedProjectTreeData])

  return { projectStructure, isPending, isError }
}

export default useFetchProjectStrcture
