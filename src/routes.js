import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import authMiddleware from './app/middlewares/auth'
import FileController from './app/controllers/FileController'
import ProviderController from './app/controllers/ProviderController'
import AppointmentController from './app/controllers/AppointmentController.js'


const routes = new Router()
const upload = multer(multerConfig)


routes.post('/sessions',  SessionController.store)
routes.post('/users', UserController.store)

routes.use(authMiddleware) 
//apointments
routes.post('/appointments', AppointmentController.store)
// users
routes.put('/users', UserController.update)
routes.get('/users', UserController.index)
//files
routes.get('/files', ProviderController.index)
routes.post('/files', upload.single('file'), FileController.store)



export default routes
