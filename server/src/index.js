import { createServer } from 'node:http';

import chokidar from 'chokidar';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';

import { PORT } from './config/serverConfig.js';
import editorHandlers from './handlers/editorHandlers.js';
import { errorHandler } from './middlewares/errorHandler.js';
import v0Router from './routes/v0Routes.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});
app.use(express.json());
app.use(express.urlencoded());

app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
  })
);

app.get('/ping', (req, res) => {
  return res.send('pong');
});

app.use('/api', v0Router);

let editorNamespace = io.of('/editor');
editorNamespace.on('connection', (socket) => {
  console.log('A user is connected');
  let projectId = socket.handshake.query.projectId;

  // Below is the file-watcher config
  if (projectId) {
    var watcher = chokidar.watch(`./projects/${projectId}`, {
      ignored: (path) => path.includes('node_modules'),
      persistent: true /** Keeps the watcher in running state till the time app is running */,
      awaitWriteFinish: {
        stabilityThreshold: 2000 /** Ensures stability of files before triggering event */,
      },
      ignoreInitial: true /** Ignores the initial files in the directory */,
    });

    watcher.on('all', (event, path) => {
      console.log(event, path);
      socket.emit('file:change', { projectId });
    });
  }
  editorHandlers(socket, editorNamespace);
  socket.on('disconnect', () => {
    console.log('A user is disconnected');
    if (watcher) {
      watcher.close();
    }
  });
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
