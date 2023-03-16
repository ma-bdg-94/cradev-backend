import express, { Handler, Router } from 'express'
const router: Router = express.Router()

import { profileValidation } from '../validations'
const { create } = profileValidation

import { profileController } from '../controllers'
const { createProfile, getCurrentProfile, getProfileList, getProfileListByType, updateProfile, deleteProfile } = profileController

import isAuth from '../middlewares/isAuth.middleware'

router.post('/', [isAuth, (create as any)], createProfile)

router.get('/', isAuth, getCurrentProfile)
router.get('/ls', isAuth, getProfileList)
router.get('/types/:userType', isAuth, getProfileListByType)
router.get('/byId/:profileId', isAuth, getProfileListByType)

router.put('/byId/:profileId', isAuth, updateProfile)

router.delete('/byId/:profileId', isAuth, deleteProfile)

export default router
