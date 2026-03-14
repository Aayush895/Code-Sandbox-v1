import { createServer } from 'node:http';

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
  editorHandlers(socket, editorNamespace);
  socket.on('disconnect', () => {
    console.log('A user is disconnected');
  });
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
