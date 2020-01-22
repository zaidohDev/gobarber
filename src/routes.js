import { Router } from 'express'
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth'

const routes = new Router()

routes.use(authMiddleware)

routes.post('/users', UserController.store)
routes.put('/users', UserController.update)
routes.post('/sessions',  SessionController.store)

export default routes
