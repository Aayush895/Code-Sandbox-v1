import Docker from 'dockerode';

import AppError from '../utils/AppError.js';

const docker = new Docker();

const portBindings = {
  '5173/tcp': [{ HostPort: '' }],
  '3000/tcp': [{ HostPort: '' }],
};
// NOTE: Below methods are necessary because the docker apis are asynchronous in nature, atleast most of them are. If we don't use these methods then earlier we were creating containers way before they were removed. This ensures that this kind of mis-match does not occur again

// In-memory state machine — single source of truth
// projectId -> { state: 'CREATING' | 'RUNNING', promise, container }
const containerRegistry = new Map();

export async function handleContainerCreation(projectId) {
  const entry = containerRegistry.get(projectId);

  // Container already running — reuse it, don't touch it
  if (entry?.state === 'RUNNING') {
    console.log(`Reusing existing container for ${projectId}`);
    return entry.container;
  }

  // Creation already in flight (e.g. two rapid connections) —
  // wait on the SAME promise instead of spawning a second create
  if (entry?.state === 'CREATING') {
    console.log(`Container already being created for ${projectId}, waiting...`);
    return entry.promise;
  }

  // Fresh create
  return _createContainer(projectId);
}

async function _createContainer(projectId) {
  const promise = _doCreate(projectId);

  containerRegistry.set(projectId, {
    state: 'CREATING',
    promise,
    container: null,
  });

  return promise;
}

async function _doCreate(projectId) {
  try {
    // Clean up any leftover from a previous server crash
    await _forceCleanupIfExists(projectId);

    console.log(`Creating container for ${projectId}`);

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

    // Mark as RUNNING — all future connections for this projectId reuse this
    containerRegistry.set(projectId, {
      state: 'RUNNING',
      promise: null,
      container,
    });

    console.log(`Container created successfully for ${projectId}`);
    return container;
  } catch (error) {
    // Remove from registry on failure so next attempt starts clean
    containerRegistry.delete(projectId);
    throw new AppError(error.message, error.statusCode);
  }
}

async function _forceCleanupIfExists(projectId) {
  try {
    const existing = await docker.listContainers({
      all: true, // include stopped containers too
      filters: { name: [`code-sandbox-v1-${projectId}`] },
    });

    if (existing.length === 0) return;

    console.log(`Found leftover container for ${projectId}, cleaning up...`);

    for (const c of existing) {
      await docker.getContainer(c.Id).remove({ force: true });
    }

    // Poll until Docker daemon confirms it's truly gone
    await _waitForRemoval(`code-sandbox-v1-${projectId}`);
  } catch (err) {
    if (err.statusCode !== 404) {
      console.error('Cleanup error:', err.message);
    }
  }
}

async function _waitForRemoval(containerName, maxWaitMs = 10000) {
  const interval = 300;
  const maxAttempts = maxWaitMs / interval;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await docker.getContainer(containerName).inspect();
      await new Promise((r) => setTimeout(r, interval));
    } catch (err) {
      if (err.statusCode === 404) return; // Confirmed gone
    }
  }
  throw new Error(`Container ${containerName} did not finish removing in time`);
}

// Call this only when a project is explicitly deleted by the user
export async function handleContainerRemoval(projectId) {
  const entry = containerRegistry.get(projectId);
  if (!entry) return;

  try {
    if (entry.state === 'CREATING') {
      await entry.promise.catch(() => {});
    }
    const container = containerRegistry.get(projectId)?.container;
    if (container) {
      await container.stop({ t: 5 });
      await container.remove({ force: true });
    }
  } catch (err) {
    if (err.statusCode !== 404) console.error('Removal error:', err.message);
  } finally {
    containerRegistry.delete(projectId);
  }
}
