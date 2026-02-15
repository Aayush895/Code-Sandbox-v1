import express from 'express'

import { createProjectController } from '../../controllers/projectControllers.js'

const reactProjectRouter = express.Router()

reactProjectRouter.post('/create', createProjectController)

export default reactProjectRouter