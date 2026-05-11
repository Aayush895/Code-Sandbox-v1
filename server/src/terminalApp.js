import { createServer } from 'node:http';

import cors from 'cors';
import express from 'express';
import { WebSocketServer } from 'ws';

import { TERMINAL_APP_SERVER,TERMINAL_PORT } from './config/serverConfig.js';
import { handleContainerCreate } from './containers/handleContainerCreation.js';
import { handleTerminalCreation } from './containers/handleTerminalCreation.js';

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

server.listen(TERMINAL_PORT, () => {
  console.log('Terminal app server is up and running on port: ', TERMINAL_PORT);
});

const terminalWebSocket = new WebSocketServer({
  server,
});

terminalWebSocket.on('connection', async (socket, req) => {
  const isTerminal = req.url.includes('/terminal');

  if (!isTerminal) return;

  const { searchParams } = new URL(req.url, TERMINAL_APP_SERVER);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    socket.send(JSON.stringify({ error: 'Missing projectId' }));
    socket.close();
    return;
  }

  try {
    const container = await handleContainerCreate(projectId);
    await handleTerminalCreation(container, socket);

    socket.on('close', () => {
      console.log(`Terminal session closed for ${projectId}`);
    });
  } catch (error) {
    console.error('Failed to create container:', error);
    socket.send(JSON.stringify('Failed to initialize terminal'));
    socket.close();
  }
});
