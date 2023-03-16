import { Request, Response } from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK
} from 'http-status'
import multer from 'multer'
import { Profile, User } from '../models'
import upload from '../utilities/helpers/fileUpload.helper'

export default class ProfileController {
  async getCurrentProfile (req: Request, res: Response): Promise<any> {
    try {
      let profile = await Profile.findOne({ user: (req as any).user.id })
      if (!profile) {
        return res.status(NOT_FOUND).json({
          errors: [
            { msg: 'Cannot find profile for this user! Would you create one?' }
          ]
        })
      }
      res.status(OK).json({ profile })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async createProfile (req: Request, res: Response): Promise<any> {
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

    const { address, postalCode, city, country, technologies } = (req as any)
      .body
    const cv: any = (req as any).file

    try {
      const user = await User.findOne({ _id: (req as any).user.id })
      let profile = await Profile.findOne({ user: user?._id })

      if (profile) {
        return res.status(BAD_REQUEST).json({
          errors: [{ msg: 'This user already have a profile!' }]
        })
      }

      profile = new Profile({
        user: (req as any).user.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        userType: user?.userType,
        phone: user?.phone,
        email: user?.email,
        photo: user?.photo,
        address,
        postalCode,
        city,
        country,
        technologies,
        cv
      })

      if (
        profile &&
        profile?.user?.toString() !== (req as any).user?.id?.toString()
      ) {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: 'Forbidden Operation!' }]
        })
      }

      await profile.save()
      res.status(CREATED).json({ profile })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async updateProfile (req: Request, res: Response): Promise<any> {
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
      firstName,
      lastName,
      email,
      phone,
      userType,
      address,
      postalCode,
      city,
      country,
      technologies
    } = (req as any).body
    const { cv, photo } = (req as any).file

    const profileFields: any = {}
    if (firstName) profileFields['firstName'] = firstName
    if (lastName) profileFields['lastName'] = lastName
    if (email) profileFields['email'] = email
    if (phone) profileFields['phone'] = phone
    if (userType) profileFields['userType'] = userType
    if (address) profileFields['address'] = address
    if (postalCode) profileFields['postalCode'] = postalCode
    if (city) profileFields['city'] = city
    if (country) profileFields['country'] = country
    if (technologies) profileFields['technologies'] = technologies
    if (cv) profileFields['cv'] = cv
    if (photo) profileFields['photo'] = photo

    try {
      let profile = await Profile.findOne({ _id: req.params.profileId })
      let user = await User.findById((req as any).user.id).select('-password')

      if (!profile) {
        return res.status(BAD_REQUEST).json({
          errors: [{ msg: 'This user already have a profile!' }]
        })
      }

      if (
        profile &&
        (profile?.user?.toString() !== (req as any).user?.id?.toString() ||
          user?.userType !== 'Admin')
      ) {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: 'Forbidden Operation!' }]
        })
      }

      profile = await Profile.findOneAndUpdate(
        { _id: req.params.profileId },
        { $set: profileFields },
        { new: true }
      )
      res.status(OK).json({ profile })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async getProfileList (req: Request, res: Response): Promise<any> {
    try {
      const profileList = await Profile.find()

      if (profileList?.length === 0) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find any profiles!' }]
        })
      }

      res.status(OK).json({ profileList })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async getProfileListByType (req: Request, res: Response): Promise<any> {
    try {
      const profileList = await Profile.find({ userType: req.params.userType })

      if (profileList?.length === 0) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find any profiles!' }]
        })
      }

      res.status(OK).json({ profileList })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async getProfile (req: Request, res: Response): Promise<any> {
    try {
      const profile = await Profile.findOne({ _id: req.params.profileId })

      if (!profile) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find any profile!' }]
        })
      }

      res.status(OK).json({ profile })
    } catch (error: any) {
      console.error(error.message)
      res
        .status(INTERNAL_SERVER_ERROR)
        .send('Server Error! Something went wrong!')
    }
  }

  async deleteProfile (req: Request, res: Response): Promise<any> {
    try {
      let profile = await Profile.findOne({ _id: req.params.profileId })
      let user = await User.findOne({ _id: (req as any).user.id })

      if (!profile) {
        return res.status(NOT_FOUND).json({
          errors: [{ msg: 'Cannot find any profile!' }]
        })
      }

      if (profile && user?.userType !== 'Admin') {
        return res.status(FORBIDDEN).json({
          errors: [{ msg: 'Forbidden Operation!' }]
        })
      }

      profile = await Profile.findByIdAndDelete({ _id: req.params.profileId })
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
