import { exec } from 'node:child_process';

import directoryTree from 'directory-tree';
import fs from 'fs';
import path from 'path';

import { createReactCommand } from '../config/serverConfig.js';
import AppError from '../utils/AppError.js';

export async function createProjectService(projectName, uniqueProjectId) {
  try {
    if (!fs.existsSync(`./projects`)) {
      // If it doesn't exist, create the directory
      fs.mkdirSync(`./projects`);
      console.log(`Directory '${`./projects`}' created.`);
    }

    // If the project has been created in the directory, then create another sub-folder with name as `unique-projectid`
    if (!fs.existsSync(`./projects/${uniqueProjectId}`)) {
      fs.mkdirSync(`./projects/${uniqueProjectId}`);
      console.log(`Directory './projects/${uniqueProjectId}' created.`);
    }

    await new Promise((resolve, reject) => {
      exec(
        createReactCommand(projectName),
        { cwd: `./projects/${uniqueProjectId}` },
        function (error) {
          if (error) {
            reject(error);
            console.log('Error: ', error);
            return;
          }

          resolve();
        }
      );
    });

    return projectName;
  } catch (error) {
    console.log('Error: ', error);
    throw new AppError('Something went wrong while creating the project', 500);
  }
}

export async function fetchProjectTreeService(uniqueProjectId) {
  try {
    const projectPath = path.resolve(`./projects/${uniqueProjectId}`);
    const projectTree = directoryTree(projectPath);
    return projectTree;
  } catch (error) {
    console.log('Error in fetching the project directory: ', error);
    return;
  }
}
