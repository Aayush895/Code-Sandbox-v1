import {
  createProjectService,
  fetchProjectTreeService,
} from '../services/projectServices.js';
import AppError from '../utils/AppError.js';

export async function createProjectController(req, res, next) {
  try {
    const projectName = req.body.projectName;

    if (!projectName) {
      throw new AppError('Project Name not received!', 422);
    }

    const projectData = await createProjectService(projectName);

    return res.status(200).send({
      success: true,
      status: 200,
      message: 'Project was created successfully!',
      data: projectData,
    });
  } catch (error) {
    console.log('Error in project controller: ', error.message);
    next(error);
  }
}

export async function fetchProjectTreeController(req, res, next) {
  try {
    const projectName = req.body.projectName;

    if (!projectName) {
      throw new AppError('Project Name not received!', 422);
    }

    const projectTree = await fetchProjectTreeService(projectName);

    return res.status(200).send({
      success: true,
      status: 200,
      message: 'Project tree was fetched successfully!',
      projectTree: projectTree,
    });
  } catch (error) {
    console.log('Error in fetching project tree controller: ', error.message);
    next(error);
  }
}
