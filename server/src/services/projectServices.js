import { exec } from 'node:child_process';
import { access,mkdir } from 'node:fs/promises';

import { CREATE_REACT_COMMAND } from '../config/serverConfig.js';

export async function createProjectService(projectName) {
  try {
    const currentWorkingDirectory = process.cwd();

    if (!access(`${currentWorkingDirectory}/projects`)) {
      mkdir(`${currentWorkingDirectory}/projects`);
    }

    // After the projects folder is created generate a boiler plate code for react-project
    exec(
      CREATE_REACT_COMMAND(projectName),
      { cwd: `${currentWorkingDirectory}/projects` },
      function (error, stdout) {
        if (error) {
          console.log('Error in creating the project: ', error.message);
          return;
        }

        console.log('Project was created successfully: ', stdout);
      }
    );

    return projectName;
  } catch (error) {
    console.log('Error: ', error);
  }
}
