import Docker from 'dockerode';

import AppError from '../utils/AppError';

const docker = new Docker();

const portBindings = {
  '5173/tcp': [{ HostPort: '0' }],
  '3000/tcp': [{ HostPort: '0' }],
};

export async function handleContainerCreation(projectId) {
  console.log('ProjectId received for container creation: ', projectId);
  try {
    const container = await docker.createContainer({
      Image: 'sandbox',
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      name: projectId,
      Volumes: {
        '/home/sandbox/app': {},
      },
      ExposedPorts: {
        '5173/tcp': {},
        '3000/tcp': {},
      },
      Env: ['HOST=0.0.0.0', `UNIQUE_ID=${projectId}`],
      HostConfig: {
        PortBindings: portBindings,
        Binds: [
          // mounting the project directory to the container
          `${process.cwd()}/projects/${projectId}:/home/sandbox/app`,
        ],
      },
      Cmd: ['/bin/bash'],
      User: 'sandbox',
    });

    console.log('Container has been created successfully');
    await container.start();
  } catch (error) {
    console.log('Error in creating the container: ', error);
    throw new AppError('Error while creating the docker container', 125);
  }
}
