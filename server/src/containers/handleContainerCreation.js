import Docker from 'dockerode';

const docker = new Docker();
const pendingCreations = new Map();

export const handleContainerCreate = async (projectId) => {
  console.log('Project id received for container create', projectId);

  const projectPathInContainer = '/home/sandbox/app';

  if (pendingCreations.has(projectId)) {
    console.log('Waiting for existing container creation...');
    return pendingCreations.get(projectId);
  }

  const creationPromise = (async () => {
    try {
      const existingContainers = await docker.listContainers({
        all: true,
        filters: {
          name: [projectId],
        },
      });

      if (existingContainers.length > 0) {
        console.log('Container already exists, removing it');
        const container = docker.getContainer(existingContainers[0].Id);
        try {
          await container.remove({ force: true });
        } catch (err) {
          console.log(
            'Error removing container (possibly already removed):',
            err.message
          );
        }
      }

      console.log('Creating a new container');

      const container = await docker.createContainer({
        Image: 'sandbox',
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['/bin/bash'],
        name: projectId,
        Tty: true,
        User: 'sandbox',
        WorkingDir: projectPathInContainer,

        Volumes: {
          [projectPathInContainer]: {},
        },

        ExposedPorts: {
          '5173/tcp': {},
          '3000/tcp': {},
        },

        Env: ['HOST=0.0.0.0'],

        HostConfig: {
          Binds: [
            `${process.cwd()}/projects/${projectId}:${projectPathInContainer}`,
          ],
          PortBindings: {
            '5173/tcp': [{ HostPort: '0' }],
            '3000/tcp': [{ HostPort: '0' }],
          },
        },
      });

      console.log('Container created', container.id);

      await container.start();
      console.log('Container started');

      return container;
    } catch (error) {
      console.error('Error while creating container:', error);
      throw error;
    } finally {
      pendingCreations.delete(projectId);
    }
  })();

  pendingCreations.set(projectId, creationPromise);

  return creationPromise;
};

// Return BOTH ports (vite + express)
export async function getContainerPorts(projectId) {
  const containers = await docker.listContainers({
    name: projectId,
  });

  if (containers.length === 0) return undefined;

  const info = await docker.getContainer(containers[0].Id).inspect();

  const getHostPort = (containerPort) => {
    try {
      return (
        info?.NetworkSettings?.Ports?.[containerPort]?.[0]?.HostPort ?? null
      );
    } catch {
      return null;
    }
  };

  return {
    react: getHostPort('5173/tcp'),
    express: getHostPort('3000/tcp'),
  };
}
