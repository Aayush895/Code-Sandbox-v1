import { createServer } from 'node:http';

import cors from 'cors';
import express from 'express';
import { WebSocketServer } from 'ws';

import { handleContainerCreation } from './containers/handleContainerCreation.js';
import { handleTerminalCreation } from './containers/handleTerminalCreation.js';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

server.listen(4000, () => {
  console.log('Terminal app server is up and running on port: ', 4000);
});

const terminalWebSocket = new WebSocketServer({
  server,
});

terminalWebSocket.on('connection', async (socket, req) => {
  const isTerminal = req.url.includes('/terminal');

  if (!isTerminal) return;

  const { searchParams } = new URL(req.url, 'http://localhost:4000');
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    socket.send(JSON.stringify({ error: 'Missing projectId' }));
    socket.close();
    return;
  }

  try {
    const container = await handleContainerCreation(projectId);
    handleTerminalCreation(container, socket);

    socket.on('close', async () => {
      try {
        console.log(`Client disconnected, removing container for ${projectId}`);
        await container.remove({ force: true });
      } catch (err) {
        console.error('Error removing container on disconnect:', err);
      }
    });
  } catch (error) {
    console.error('Failed to create container:', error);
    socket.send(JSON.stringify({ error: 'Failed to initialize terminal' }));
    socket.close();
  }
});
