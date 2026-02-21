import cors from 'cors';
import express from 'express';

import { PORT } from './config/serverConfig.js';
import { errorHandler } from './middlewares/errorHandler.js';
import v0Router from './routes/v0Routes.js';

const app = express();
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

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
