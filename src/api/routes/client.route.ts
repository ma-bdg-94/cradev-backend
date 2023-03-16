import express, { Handler, Router } from 'express'
const router: Router = express.Router()

import { clientValidation } from '../validations'
const { newClientValidation } = clientValidation

import { clientController } from '../controllers'
const { addClient, getClientList, getClientListByService, getClient, updateClient, removeClient } = clientController

import isAuth from '../middlewares/isAuth.middleware'

router.post('/', [isAuth, (newClientValidation as any)], addClient)

router.get('/ls', isAuth, getClientList)
router.get('/services/:serviceCode', isAuth, getClientListByService)
router.get('/byId/:clientId', isAuth, getClient)

router.put('/byId/:clientId', isAuth, updateClient)

router.delete('/byId/:clientId', isAuth, removeClient)

export default router
