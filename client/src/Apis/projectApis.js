import axiosInstance from '../Utils/axiosInstance'

export async function createProject(projectName) {
  const createProjectResponse = await axiosInstance.post('/api/v0/create', {
    projectName,
  })

  return createProjectResponse?.data
}

export async function fetchProjectTree(projectId) {
  try {
    const fetchProjectResponse = await axiosInstance.get(
      `api/v0/project-tree/${projectId}`,
    )

    return fetchProjectResponse?.data
  } catch (error) {
    console.log('Error: ', error)
  }
}
