import { v4 as uuidv4 } from 'uuid';

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

    const uniqueProjectId = uuidv4();
    const projectData = await createProjectService(
      projectName,
      uniqueProjectId
    );

    if (JSON.stringify(projectData) == '{}') {
      console.log('Project already exists');
      return res.status(409).send({
        success: false,
        status: 409,
        message: `Project with name - ${projectName} already exists`,
        data: projectData,
      });
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: 'Project was created successfully!',
      data: projectData,
      id: uniqueProjectId,
    });
  } catch (error) {
    console.log('Error in project controller: ', error.message);
    next(error);
  }
}

export async function fetchProjectTreeController(req, res, next) {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      throw new AppError('Project Name not received!', 422);
    }

    const projectTree = await fetchProjectTreeService(projectId);

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
