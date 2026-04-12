/* eslint-disable no-useless-assignment */
import { exec } from 'node:child_process';

import directoryTree from 'directory-tree';
import fs from 'fs';
import path from 'path';

import {
  createExpressApp,
  createReactCommand,
  createReactExpressApp,
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

async function setupFullStackProject(clientPath, serverPath) {
  let projectCreationCommand = null;
  projectCreationCommand = createReactExpressApp(true);
  await new Promise((resolve, reject) => {
    exec(
      projectCreationCommand('.'),
      { cwd: clientPath },
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

  projectCreationCommand = createReactExpressApp(false);

  await new Promise((resolve, reject) => {
    exec(
      projectCreationCommand('.'),
      { cwd: serverPath },
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
  try {
    const basePath = `./projects/${uniqueProjectId}`;
    fs.mkdirSync(basePath, { recursive: true });
    console.log(`Directory './projects/${uniqueProjectId}' created.`);

    return `./projects/${uniqueProjectId}`;
  } catch (error) {
    throw new AppError(
      `Failed to create project directory [id=${uniqueProjectId}]: ${error.message}`
    );
  }
}

export async function createProjectService(
  projectName,
  projectType,
  uniqueProjectId
) {
  try {
    const path = createProjectRepositories(uniqueProjectId);

    let directoryPath = path;
    if (projectType == 'fullstack') {
      // Create the folder with project name
      fs.mkdirSync(`${directoryPath}/${projectName}`);
      // We are creating a full stack project
      // Create 2 folders, one for client and another for server
      let clientPath = `${directoryPath}/${projectName}/client`;
      let serverPath = `${directoryPath}/${projectName}/server`;
      fs.mkdirSync(clientPath);
      fs.mkdirSync(serverPath);

      await setupFullStackProject(clientPath, serverPath, projectName);
    } else {
      await setupSingleProject(directoryPath, projectType, projectName);
    }

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
