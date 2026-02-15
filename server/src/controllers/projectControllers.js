import { createProjectService } from '../services/projectServices.js';

export async function createProjectController(req, res) {
  try {
    const projectName = req.body.projectName;
    const projectId = await createProjectService(projectName);

    return res.status(200).send({
      success: true,
      status: 200,
      message: 'Project was created successfully!',
      data: projectId,
    });
  } catch (error) {
    console.log('Error in project controller: ', error.message);
  }
}
