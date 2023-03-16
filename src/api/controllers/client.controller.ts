import { Request, Response } from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'
import { url } from 'gravatar'
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK
} from 'http-status'
import multer from 'multer'
import { Client, User } from '../models'
import upload from '../utilities/helpers/fileUpload.helper'
import { getClientServiceCode } from '../utilities/helpers/getClientServiceCode'

export default class ClientController {
  async addClient (req: Request, res: Response): Promise<any> {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: errors.array({ onlyFirstError: true }) })
    }

    const uploadMiddleware = upload.single('cv')

    uploadMiddleware(req, res, async (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(BAD_REQUEST).json({ errors: [{ msg: err.message }] })
      } else if (err) {
        console.error(err.message)
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ errors: [{ msg: 'Server Error! Something went wrong!' }] })
      }
    })

    const {
      address,
      postalCode,
      city,
      country,
      fullName,
      clientType,
      email,
      phone,
      service
    } = (req as any).body
    let logo = ''

    if ((req as any).file) {
      logo = (req as any).file.path
    } else {
      const avatarUrl = url(email, { s: '200', d: 'retro' }, true)
      logo = avatarUrl
    }

    let serviceCode = getClientServiceCode(service)

    try {
      const user = await User.findOne({ _id: (req as any).user.id })

      let client = new Client({
        user: (req as any).user.id,
        fullName,
        clientType,
        phone,
        email,
        logo,
        address,
        postalCode,
        city,
        country,
        service,
        serviceCode
      })

      if (user?.userType !== 'Admin') {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: 'Forbidden Operation!' }]
        })
      }

      await client.save()
      res.status(CREATED).json({ client })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async updateClient (req: Request, res: Response): Promise<any> {
    const uploadMiddleware = upload.single('cv')

    uploadMiddleware(req, res, async (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(BAD_REQUEST).json({ errors: [{ msg: err.message }] })
      } else if (err) {
        console.error(err.message)
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ errors: [{ msg: 'Server Error! Something went wrong!' }] })
      }
    })

    const {
      address,
      postalCode,
      city,
      country,
      fullName,
      clientType,
      email,
      service,
      phone
    } = (req as any).body
    const { logo } = (req as any).file
    const serviceCode = getClientServiceCode(service)

    const clientFields: any = {}
    if (fullName) clientFields['fullName'] = fullName
    if (clientType) clientFields['clientType'] = clientType
    if (email) clientFields['email'] = email
    if (phone) clientFields['phone'] = phone
    if (service) clientFields['service'] = service
    if (address) clientFields['address'] = address
    if (postalCode) clientFields['postalCode'] = postalCode
    if (city) clientFields['city'] = city
    if (country) clientFields['country'] = country
    if (logo) clientFields['logo'] = logo
    if (serviceCode) clientFields['serviceCode'] = serviceCode

    try {
      let client = await Client.findOne({ _id: req.params.clientId })
      let user = await User.findById((req as any).user.id).select('-password')

      if (!client) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find this client!' }]
        })
      }

      if (
        client &&
        (client?.user?.toString() !== (req as any).user?.id?.toString() ||
          user?.userType !== 'Admin')
      ) {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: 'Forbidden Operation!' }]
        })
      }

      client = await Client.findOneAndUpdate(
        { _id: req.params.clientId },
        { $set: clientFields },
        { new: true }
      )
      res.status(OK).json({ client })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async getClientList (req: Request, res: Response): Promise<any> {
    try {
      const clientList = await Client.find()

      if (clientList?.length === 0) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find any clients!' }]
        })
      }

      res.status(OK).json({ clientList })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async getClientListByService (req: Request, res: Response): Promise<any> {
    try {
      const clientList = await Client.find({ userType: req.params.serviceCode })

      if (clientList?.length === 0) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find any clients!' }]
        })
      }

      res.status(OK).json({ clientList })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async getClient (req: Request, res: Response): Promise<any> {
    try {
      const client = await Client.findOne({ _id: req.params.clientId })

      if (!client) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find any client!' }]
        })
      }

      res.status(OK).json({ client })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async removeClient (req: Request, res: Response): Promise<any> {
    try {
      let client = await Client.findOne({ _id: req.params.clientId })
      let user = await User.findOne({ _id: (req as any).user.id })

      if (!client) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find any client!' }]
        })
      }

      if (client && user?.userType !== 'Admin') {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: 'Forbidden Operation!' }]
        })
      }

      client = await Client.findByIdAndDelete({ _id: req.params.clientId })
      user = await User.findOneAndUpdate(
        { _id: (req as any).user.id },
        { deleted: true },
        { new: true }
      )

      res.status(OK).json({
        errors: [{ msg: 'Succeed Operation!' }]
      })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }
}
