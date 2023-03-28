import { compare, genSalt, hash } from 'bcryptjs'
import { Request, Response } from 'express'
import { validationResult, Result } from 'express-validator'
import { ValidationError } from 'express-validator/src/base'
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED
} from 'http-status'
import { sign } from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import upload from '../utilities/helpers/fileUpload.helper'
import multer from 'multer'
import { url } from 'gravatar'
import { signToken } from '../utilities/helpers/signToken.helper'

import { User } from '../models'
import sendPasswordMail from '../utilities/helpers/sendPasswordMail.helper'
import { verifyToken } from '../utilities/helpers/verifyToken.helper'

export default class UserController {
  async registerAdmin (req: Request, res: Response): Promise<any> {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: errors.array({ onlyFirstError: true }) })
    }

    const uploadMiddleware = upload.single('photo') // 'photo' is the field name in the form data

    uploadMiddleware(req, res, async (err: any) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(BAD_REQUEST).json({ errors: [{ msg: err.message }] })
      } else if (err) {
        // An unknown error occurred when uploading.
        console.error(err.message)
        return res
          .status(INTERNAL_SERVER_ERROR)
          .json({ errors: [{ msg: 'Server Error! Something went wrong!' }] })
      }
    })

    const { firstName, lastName, email, phone, password } = (req as any).body
    let photo = ''

    if ((req as any).file) {
      photo = (req as any).file.path
    } else {
      const avatarUrl = url(email, { s: '200', d: 'retro' }, true)
      photo = avatarUrl
    }

    try {
      let user = await User.findOne({ $or: [{ email }, { phone }] })
      if (user) {
        return res.status(CONFLICT).json({
          errors: [{ msg: 'Already existing user with those credentials!' }]
        })
      }

      user = new User({
        firstName,
        lastName,
        userType: 'Admin',
        email,
        phone,
        photo,
        password
      })

      await user.save()

      const payload = {
        user: {
          id: user.id
        }
      }

      const token = await signToken(payload)
      return res.status(CREATED).json({ token })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async loginUser (req: Request, res: Response): Promise<any> {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: errors.array({ onlyFirstError: true }) })
    }

    const { email, phone, password } = (req as any).body

    const signToken = (payload: any) => {
      return new Promise((resolve, reject) => {
        sign(
          payload,
          process.env.JWT_SECRET!,
          { expiresIn: '1h' },
          (error, token) => {
            if (error) reject(error)
            resolve(token)
          }
        )
      })
    }

    try {
      let user = await User.findOne({ $or: [{ email }, { phone }] })
      if (!user) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find user with those credentials!' }]
        })
      }

      const isMatch: boolean = await compare(password, user.password)
      if (!isMatch) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find user with those credentials!' }]
        })
      }

      const payload: any = {
        user: {
          id: user.id
        }
      }

      const token = await signToken(payload)
      return res.status(OK).json({ token })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async addNewUser (req: Request, res: Response): Promise<any> {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
      return res
        .status(BAD_REQUEST)
        .json({ errors: errors.array({ onlyFirstError: true }) })
    }

    const { firstName, lastName, email, userType, phone } = (req as any).body

    try {
      let currentUser = await User.findOne({ _id: (req as any).user.id })

      if (currentUser?.userType !== 'Admin') {
        return res.status(UNAUTHORIZED).json({
          errors: [
            { msg: 'Unauthorized! Only admin has the right to add users' }
          ]
        })
      }

      const password = await randomBytes(5).toString()

      let user = await User.findOne({ $or: [{ email }, { phone }] })
      if (user) {
        return res.status(CONFLICT).json({
          errors: [{ msg: 'Already existing user with those credentials!' }]
        })
      }

      user = new User({
        firstName,
        lastName,
        userType,
        email,
        phone,
        password: password
      })

      if (user?.userType == 'Admin') {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: 'Forbidden! Only one admin is permitted' }]
        })
      }

      await user.save()

      return res.status(CREATED).json({ user })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async getAuthUser (req: Request, res: Response): Promise<any> {
    try {
      const user = await User.findOne({ _id: (req as any).user.id }).select(
        '-password'
      )

      if (!user) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find user' }]
        })
      }

      res.status(OK).json({ user })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async getUser (req: Request, res: Response): Promise<any> {
    try {
      const user = await User.findOne({
        _id: req.params.userId,
        deleted: false
      }).select('-password')

      if (!user) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find user' }]
        })
      }

      res.status(OK).json({ user })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async getUsersByType (req: Request, res: Response): Promise<any> {
    try {
      const users = await User.find({
        userType: req.params.userType,
        deleted: false
      }).select('-password')

      if (users?.length == 0) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find users' }]
        })
      }

      res.status(OK).json({ users })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async removeUser (req: Request, res: Response): Promise<any> {
    try {
      let currentUser = await User.findOne({ _id: (req as any).user.id })

      if (currentUser?.userType !== 'Admin') {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: 'Only Admins!' }]
        })
      }

      let user = await User.findOne({
        _id: req.params.userId,
        deleted: false
      }).select('-password')

      if (!user) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find user' }]
        })
      }

      user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: { deleted: true } },
        { new: true }
      )

      res.status(OK).json({ user })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async requestPasswordChange (req: Request, res: Response): Promise<any> {
    const { email } = (req as any).body
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find user with those credentials!' }]
        })
      }
      const payload: any = {
        user: {
          id: user.id
        }
      }
      const token = await signToken(payload)
      await sendPasswordMail(email, token, user.firstName)
      res.status(CREATED).json({ msg: 'Email sent!' })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async updatePassword (req: Request, res: Response): Promise<any> {
    try {
      const verify = await verifyToken(req.params.token)
      if (!verify) {
        return res.status(BAD_REQUEST).json({
          status: false,
          message: 'Invalid Token !'
        })
      }
      const user = await User.findOne({ _id: (req as any).user.id })

      if (!user) {
        return res.status(NOT_FOUND).json({
          status: false,
          message: 'Cannot find user with those credentials!'
        })
      }

      const salt = await genSalt(parseInt(process.env.BCRYPTJS_ROUNDS!))
      const newPassword = await hash((req as any).body.password, salt)
      const result = await User.findByIdAndUpdate((req as any).user.id, {
        $set: { password: newPassword }
      })
      console.log(result)
      res.send({ status: true, message: 'passorw updated successfully' })
    } catch (error) {
      console.log(error)
    }
  }
}
