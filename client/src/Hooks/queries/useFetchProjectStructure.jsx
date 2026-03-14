/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { fetchProjectTree } from '../../Apis/projectApis'
import useProjectStore from '../../store/useProjectStore'

function useFetchProjectStrcture(projectId) {
  const { projectStructure, setProjectStructure } = useProjectStore()
  const {
    isPending,
    isError,
    data: fetchedProjectTreeData,
  } = useQuery({
    queryKey: [projectId],
    queryFn: async () => await fetchProjectTree(projectId),
  })

  useEffect(() => {
    if (fetchedProjectTreeData) {
      setProjectStructure(fetchedProjectTreeData)
    }
  }, [fetchedProjectTreeData])

  return { projectStructure, isPending, isError }
}

export default useFetchProjectStrcture
