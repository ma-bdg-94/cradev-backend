import express, { Router } from 'express'
const router: Router = express.Router()

import userRoutes from './user.route'
import profileRoutes from './profile.route'


router.use('/api/users', userRoutes)
router.use('/api/profiles', profileRoutes)

export default router
