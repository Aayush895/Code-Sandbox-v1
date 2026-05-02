# Preventing the Docker Container Race Condition in Node.js

A reference guide for managing container lifecycle safely with `dockerode`.

---

## The Problem

When you call `container.remove()` via dockerode, the Docker daemon **accepts the request and returns immediately** — but the actual cleanup (unmounting filesystems, releasing network interfaces, deleting layer data) continues asynchronously in the background.

If you try to create a new container with the same name before the daemon finishes cleaning up the old one, you get:

```
Error response from daemon: removal of container <id> is already in progress
```

This error is **intermittent** because the race outcome depends on how fast the daemon cleans up at that exact moment — which varies based on system load, container size, and available memory. Sometimes it finishes in time, sometimes it doesn't.

### The Timeline

```
container.remove() called
        ↓
Daemon: "request accepted" ← API returns HERE
        ↓ (daemon still cleaning up internally)
Your code: createContainer() with same name
        ↓
        ├── Daemon finished in time  → ✅ succeeds (random)
        └── Daemon still cleaning   → ❌ "removal already in progress" (random)
```

### Common Trigger: WebSocket Reconnect

This is especially common when container lifetime is tied to WebSocket lifetime:

```
User refreshes browser
        ↓
WebSocket disconnects → your code removes container
        ↓
WebSocket reconnects  → your code creates container
        ↓
Race condition — removal may not be done yet 💥
```

---

## The Root Cause

Two separate conceptual mistakes compound to create this problem:

**Mistake 1 — Container lifetime tied to WebSocket lifetime**
The container is removed on every disconnect and recreated on every reconnect. A browser refresh causes a rapid disconnect/reconnect cycle that always risks the race.

**Mistake 2 — No state tracking**
Without a registry of what state each container is in, two near-simultaneous requests (e.g. from a fast refresh) can both attempt to remove and recreate the same container concurrently.

---

## The Fix

### Conceptual Shift

```
❌ Old: container lifetime = WebSocket connection lifetime
✅ New: container lifetime = project lifetime
```

Stop removing containers on disconnect. Let the container keep running and reuse it on reconnect. Only remove it when the user explicitly deletes the project.

### In Practice: A Container Registry + State Machine

Track every container in an in-memory registry with explicit states. This makes concurrent and duplicate operations impossible.

```
States:
  CREATING → container is being created, not ready yet
  RUNNING  → container is up and safe to reuse
  (absent) → container does not exist
```

---

## Reference Implementation

```javascript
import Docker from 'dockerode';
import AppError from '../utils/AppError.js';

const docker = new Docker();

// Single source of truth for all container states
// projectId -> { state: 'CREATING' | 'RUNNING', promise, container }
const containerRegistry = new Map();

/**
 * Gets an existing container or creates a new one for the given projectId.
 * Safe to call on every WebSocket connection — handles all race conditions.
 */
export async function handleContainerCreation(projectId) {
  const entry = containerRegistry.get(projectId);

  // Container already running — reuse it, don't touch it
  // This is the common path on refresh/reconnect
  if (entry?.state === 'RUNNING') {
    console.log(`Reusing existing container for ${projectId}`);
    return entry.container;
  }

  // Creation already in flight (e.g. two rapid connections for same project)
  // Wait on the SAME promise instead of spawning a second create
  // This prevents duplicate container creation
  if (entry?.state === 'CREATING') {
    console.log(`Container already being created for ${projectId}, waiting...`);
    return entry.promise;
  }

  // No entry — fresh create
  return _createContainer(projectId);
}

/**
 * Registers the CREATING state immediately (before async work starts),
 * so any concurrent calls see the in-flight promise and wait on it.
 */
async function _createContainer(projectId) {
  const promise = _doCreate(projectId);

  // Set CREATING state synchronously before any awaits
  // This is critical — if you awaited first, a second call could
  // slip in before the state was set and spawn a duplicate create
  containerRegistry.set(projectId, {
    state: 'CREATING',
    promise,
    container: null,
  });

  return promise;
}

async function _doCreate(projectId) {
  try {
    // On server restart, there may be leftover containers from a previous crash
    // Clean them up safely before creating a fresh one
    await _forceCleanupIfExists(projectId);

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
        PortBindings: {
          '5173/tcp': [{ HostPort: '' }],
          '3000/tcp': [{ HostPort: '' }],
        },
        Binds: [
          `${process.cwd()}/projects/${projectId}:${projectPathInContainer}`,
        ],
      },
      Cmd: ['/bin/bash'],
      User: 'sandbox',
    });

    await container.start();

    // Transition to RUNNING — all future connections reuse this container
    containerRegistry.set(projectId, {
      state: 'RUNNING',
      promise: null,
      container,
    });

    return container;
  } catch (error) {
    // Clean up registry on failure so the next attempt starts fresh
    containerRegistry.delete(projectId);
    throw new AppError(error.message, error.statusCode);
  }
}

/**
 * Removes leftover containers from a previous server crash.
 * Called once during container creation as a safety net.
 *
 * Uses polling (_waitForRemoval) because container.remove() is
 * asynchronous at the daemon level — the API returns before
 * cleanup is actually complete.
 */
async function _forceCleanupIfExists(projectId) {
  try {
    const existing = await docker.listContainers({
      all: true, // include stopped containers
      filters: { name: [`code-sandbox-v1-${projectId}`] },
    });

    if (existing.length === 0) return;

    for (const c of existing) {
      await docker.getContainer(c.Id).remove({ force: true });
    }

    // Wait for the daemon to fully finish removal before proceeding
    // Without this, the subsequent createContainer call can still race
    await _waitForRemoval(`code-sandbox-v1-${projectId}`);
  } catch (err) {
    if (err.statusCode !== 404) {
      console.error('Cleanup error:', err.message);
    }
  }
}

/**
 * Polls the Docker daemon until a container is confirmed gone (404).
 *
 * WHY THIS IS NEEDED:
 * container.remove() resolves when the daemon *accepts* the request,
 * not when removal is *complete*. The daemon cleans up asynchronously.
 * The only reliable signal that a container is truly gone is a 404
 * from inspect(). Without this, createContainer() with the same name
 * can fail intermittently with "removal already in progress".
 *
 * This is a polling pattern — used here because the Docker API provides
 * no callback or event for "container fully removed".
 */
async function _waitForRemoval(containerName, maxWaitMs = 10000) {
  const interval = 300;
  const maxAttempts = maxWaitMs / interval;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await docker.getContainer(containerName).inspect();
      // Container still exists — wait and try again
      await new Promise((r) => setTimeout(r, interval));
    } catch (err) {
      if (err.statusCode === 404) return; // Confirmed gone — safe to proceed
    }
  }

  throw new Error(`Container ${containerName} did not finish removing in time`);
}

/**
 * Permanently removes a container and cleans up the registry.
 * Call this ONLY when the user explicitly deletes a project.
 *
 * DO NOT call this on:
 *   - WebSocket disconnect
 *   - Browser tab close
 *   - Page refresh
 *   - User logout
 */
export async function handleContainerRemoval(projectId) {
  const entry = containerRegistry.get(projectId);
  if (!entry) return;

  try {
    // If creation is still in flight, wait for it to finish before removing
    // You can't remove a container that doesn't fully exist yet
    if (entry.state === 'CREATING') {
      await entry.promise.catch(() => {});
    }

    // Re-read after await — the entry may have been updated during creation
    const container = containerRegistry.get(projectId)?.container;

    if (container) {
      await container.stop({ t: 5 }); // 5 second grace period before force kill
      await container.remove({ force: true });
    }
  } catch (err) {
    if (err.statusCode !== 404) console.error('Removal error:', err.message);
  } finally {
    // Always clean up the registry — even if Docker calls failed
    // Using finally ensures no stale entries are left behind
    containerRegistry.delete(projectId);
  }
}
```

---

## Usage in Your Server

```javascript
import { handleContainerCreation, handleContainerRemoval } from './handleContainerCreation.js';

// On every WebSocket connection — safe to call on refresh
wss.on('connection', async (ws, req) => {
  const projectId = req.url.split('/')[1];

  const container = await handleContainerCreation(projectId);
  // ... attach terminal to container

  // On disconnect: close the terminal session only
  // Do NOT remove the container — it survives reconnects
  ws.on('close', () => {
    closeTerminal(sessionId);
    // ← no container removal here
  });
});

// Only remove when the user explicitly deletes the project
app.delete('/project/:projectId', async (req, res) => {
  await handleContainerRemoval(req.params.projectId);
  res.json({ success: true });
});
```

---

## Key Rules to Remember

| Rule | Why |
|---|---|
| Never remove a container on WebSocket disconnect | Refresh = disconnect + immediate reconnect. Container must survive this. |
| Set `CREATING` state synchronously before any `await` | Prevents a second concurrent call from spawning a duplicate create. |
| Always poll after `remove()` before creating same-named container | `remove()` resolves before daemon finishes. 404 from `inspect()` is the only reliable "done" signal. |
| Re-read registry after awaiting a `CREATING` promise | The entry is updated during creation. Your pre-await reference is stale. |
| Use `finally` for registry cleanup in removal | Ensures no stale entries even when Docker API calls throw. |
| Only call `handleContainerRemoval` from an explicit delete action | Every other disconnection event is temporary. |

---

## Why the Error Was Intermittent

The race condition didn't fail every time because removal speed depends on runtime conditions:

```
Fast removal  (light load, small container)  → create succeeds ✅
Slow removal  (busy daemon, large container) → "already in progress" ❌
```

This is what made it hard to debug — it worked fine locally under low load but failed unpredictably in real usage.

---

## Further Reading

- [Docker Engine API — DELETE /containers/{id}](https://docs.docker.com/engine/api/) — confirms removal is asynchronous
- [moby/moby #29040](https://github.com/moby/moby/issues/29040) — "removal already in progress" via Docker socket
- [docker/cli #4716](https://github.com/docker/cli/issues/4716) — confirmed race condition in Docker lifecycle management
- [dockerode #582](https://github.com/apocas/dockerode/issues/582) — race condition filed directly on the dockerode repo
- [Node.js Race Conditions](https://nodejsdesignpatterns.com/blog/node-js-race-conditions/) — mutex and async race condition patterns in Node.js