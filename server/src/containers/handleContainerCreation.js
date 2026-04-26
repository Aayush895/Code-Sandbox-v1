import Docker from 'dockerode';

import AppError from '../utils/AppError.js';

const docker = new Docker();
const pendingCreations = new Map();

const portBindings = {
  '5173/tcp': [{ HostPort: '' }],
  '3000/tcp': [{ HostPort: '' }],
};

export async function handleContainerCreation(projectId) {
  console.log('ProjectId received for container creation: ', projectId);

  if (pendingCreations.has(projectId)) {
    console.log('Already in progress, waiting for existing call...');
    return pendingCreations.get(projectId);
  }

  const creationPromise = _createContainer(projectId);
  pendingCreations.set(projectId, creationPromise);

  try {
    return await creationPromise;
  } finally {
    pendingCreations.delete(projectId);
  }
}

async function _createContainer(projectId) {
  try {
    const existingContainers = await docker.listContainers({
      all: true,
      filters: JSON.stringify({ name: [`code-sandbox-v1-${projectId}`] }),
    });

    console.log('Existing containers:', existingContainers);

    if (existingContainers.length > 0) {
      console.log('Container already exists, removing it');
      const container = docker.getContainer(existingContainers[0].Id);
      await container.remove({ force: true });
    }

    const projectPathInContainer = `/home/sandbox/app/${projectId}`;
    const container = await docker.createContainer({
      Image: 'code-sandbox-v1',
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      name: `code-sandbox-v1-${projectId}`,
      WorkingDir: projectPathInContainer,
      Volumes: { '/home/sandbox/app': {} },
      ExposedPorts: { '5173/tcp': {}, '3000/tcp': {} },
      Env: ['HOST=0.0.0.0', `UNIQUE_ID=${projectId}`],
      HostConfig: {
        PortBindings: portBindings,
        Binds: [
          `${process.cwd()}/projects/${projectId}:${projectPathInContainer}`,
        ],
      },
      Cmd: ['/bin/bash'],
      User: 'sandbox',
    });

    await container.start();
    console.log('Container created successfully');
    return container;
  } catch (error) {
    throw new AppError(error.message, error.statusCode);
  }
}
