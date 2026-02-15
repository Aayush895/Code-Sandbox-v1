import express from 'express'

import reactProjectRouter from './react-project-routes/reactProjectRoutes.js'

const v0Router = express.Router()

v0Router.use('/v0', reactProjectRouter)

export default v0Router