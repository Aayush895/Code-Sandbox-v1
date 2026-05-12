/* eslint-disable no-useless-assignment */
import { exec } from 'node:child_process';

import directoryTree from 'directory-tree';
import fs from 'fs';
import path from 'path';

import {
  createExpressApp,
  createReactCommand,
} from '../config/serverConfig.js';
import AppError from '../utils/AppError.js';

async function setupSingleProject(directoryPath, projectType, projectName) {
  await new Promise((resolve, reject) => {
    let projectCreationCommand = null;

    if (projectType == 'react') {
      projectCreationCommand = createReactCommand;
    } else {
      projectCreationCommand = createExpressApp;
    }
    exec(
      projectCreationCommand(projectName),
      { cwd: directoryPath },
      function (error, stdout, stderr) {
        if (error) {
          reject(
            new AppError(`Command failed: ${stderr || error.message}`, 500)
          );
          console.log('Error: ', error);
          return;
        }

        resolve(stdout);
      }
    );
  });
}

function createProjectRepositories(uniqueProjectId) {
  return new Promise((resolve, reject) => {
    try {
      const basePath = path.resolve(`./projects/${uniqueProjectId}`);
      fs.mkdirSync(basePath, { recursive: true });
      console.log(`Directory created at: ${basePath}`);

      exec(
        `chown -R sandbox:sandbox ${basePath} && chmod -R 777 ${basePath}`,
        (error) => {
          if (error) {
            reject(
              new AppError(`Failed to set ownership: ${error.message}`, 500)
            );
            return;
          }
          resolve(basePath);
        }
      );
    } catch (error) {
      reject(
        new AppError(
          `Failed to create project directory [id=${uniqueProjectId}]: ${error.message}`
        )
      );
    }
  });
}

export async function createProjectService(
  projectName,
  projectType,
  uniqueProjectId
) {
  try {
    const directoryPath = await createProjectRepositories(uniqueProjectId);
    await setupSingleProject(directoryPath, projectType, projectName);

    await new Promise((resolve, reject) => {
      exec(
        `chown -R sandbox:sandbox ${directoryPath} && chmod -R 777 ${directoryPath}`,
        (error) => {
          if (error) {
            reject(
              new AppError(
                `Failed to set ownership after setup: ${error.message}`,
                500
              )
            );
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
