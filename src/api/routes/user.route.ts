import express, { Handler, Router } from 'express'
const router: Router = express.Router()

import { userValidation } from '../validations'
const { register, login, addUser, passwordRequest, passwordUpdate } = userValidation

import { userController } from '../controllers'
const { registerAdmin, loginUser, addNewUser, getAuthUser, getUser, getUsersByType, removeUser, requestPasswordChange, updatePassword } = userController

import isAuth from '../middlewares/isAuth.middleware'
import upload from '../utilities/helpers/fileUpload.helper'

router.post('/auth/new', [upload.single('photo'), (register as any)], registerAdmin)
router.post('/auth', login, loginUser)
router.post('/', [isAuth, (addUser as any)], addNewUser)
router.post('/reset-password', passwordRequest, requestPasswordChange)

router.get('/', isAuth, getAuthUser)
router.get('/:userId', isAuth, getUser)
router.get('/types/:userType', isAuth, getUsersByType)

router.put('/remove/:userId', isAuth, removeUser)
router.put('./reset-password/:token', passwordUpdate, updatePassword)

export default router
