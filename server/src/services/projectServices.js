import { exec } from 'node:child_process';

import directoryTree from 'directory-tree';
import fs from 'fs';
import path from 'path';

import { createReactCommand } from '../config/serverConfig.js';
import AppError from '../utils/AppError.js';

export async function createProjectService(projectName) {
  try {
    if (!fs.existsSync(`./projects`)) {
      // If it doesn't exist, create the directory
      fs.mkdirSync(`./projects`);

      console.log(`Directory '${`./projects`}' created.`);
    }
    // If the project folder already exists then just check if a directory with the same project name exists or not. If it does, just return with an empty array
    if (fs.existsSync(`./projects/${projectName}`)) {
      console.log(`Directory '${`./projects/${projectName}`}' already exists.`);
      return {};
    }

    await new Promise((resolve, reject) => {
      exec(
        createReactCommand(projectName),
        { cwd: `./projects` },
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

export async function fetchProjectTreeService(projectName) {
  try {
    const projectPath = path.resolve(`./projects/${projectName}`);
    const projectTree = directoryTree(projectPath);
    return projectTree;
  } catch (error) {
    console.log('Error in fetching the project directory: ', error);
    return;
  }
}
