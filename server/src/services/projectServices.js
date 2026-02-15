import { exec } from 'node:child_process';
import { access, mkdir } from 'node:fs/promises';

import directoryTree from 'directory-tree';

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
      function (error) {
        if (error) {
          console.log('Error in creating the project: ', error.message);
          return;
        }
      }
    );

    return projectName;
  } catch (error) {
    console.log('Error: ', error);
  }
}

export async function fetchProjectTreeService(projectName) {
  try {
    const projectPath = `${process.cwd()}/projects/${projectName}`;
    const projectTree = directoryTree(projectPath);
    return projectTree;
  } catch (error) {
    console.log('Error in fetching the project directory: ', error);
    return;
  }
}
