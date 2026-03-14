import express from 'express';

import {
  createProjectController,
  fetchProjectTreeController,
} from '../../controllers/projectControllers.js';

const reactProjectRouter = express.Router();

reactProjectRouter.post('/create', createProjectController);
reactProjectRouter.get('/project-tree/:projectId', fetchProjectTreeController);

export default reactProjectRouter;
