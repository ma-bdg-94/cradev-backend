import express, { Router } from 'express'
const router: Router = express.Router()

import userRoutes from './user.route'
import profileRoutes from './profile.route'
import clientRoutes from './client.route'
import projectRoutes from './profile.route'


router.use('/api/users', userRoutes)
router.use('/api/profiles', profileRoutes)
router.use('/api/clients', clientRoutes)
router.use('/api/projects', projectRoutes)

export default router
