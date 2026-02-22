import axiosInstance from '../Utils/axiosInstance'

export async function createProject(projectName) {
  try {
    const createProjectResponse = await axiosInstance.post('/api/v0/create', {
      projectName,
    })

    return createProjectResponse?.data
  } catch (error) {
    console.log('Error: ', error)
  }
}

export async function fetchProjectTree(projectName) {
  try {
    const fetchProjectResponse = await axiosInstance.post(
      'api/v0/project-tree',
      {
        projectName,
      },
    )

    console.log('LOGGING RESPONSE PROJECT-TREE: ', fetchProjectResponse)
    return fetchProjectResponse?.data
  } catch (error) {
    console.log('Error: ', error)
  }
}
