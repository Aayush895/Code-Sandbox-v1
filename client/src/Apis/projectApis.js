import axiosInstance from '../Utils/axiosInstance'

export async function createProject(project) {
  const createProjectResponse = await axiosInstance.post('/api/v0/create', {
    projectName: project.projectName,
    projectType: project.projectType,
  })

  return createProjectResponse?.data
}

export async function fetchProjectTree(projectId) {
  const fetchProjectResponse = await axiosInstance.get(
    `api/v0/project-tree/${projectId}`,
  )
  return fetchProjectResponse?.data
}
