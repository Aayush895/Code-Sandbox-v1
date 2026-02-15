import {
  createProjectService,
  fetchProjectTreeService,
} from '../services/projectServices.js';

export async function createProjectController(req, res) {
  try {
    const projectName = req.body.projectName;
    const projectData = await createProjectService(projectName);

    return res.status(200).send({
      success: true,
      status: 200,
      message: 'Project was created successfully!',
      data: projectData,
    });
  } catch (error) {
    console.log('Error in project controller: ', error.message);
  }
}

export async function fetchProjectTreeController(req, res) {
  try {
    const projectName = req.body.projectName;
    const projectTree = await fetchProjectTreeService(projectName);

    return res.status(200).send({
      success: true,
      status: 200,
      message: 'Project tree was fetched successfully!',
      projectTree: projectTree,
    });
  } catch (error) {
    console.log('Error in fetching project tree controller: ', error.message);
  }
}
