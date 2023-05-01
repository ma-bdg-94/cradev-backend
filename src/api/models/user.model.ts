import { Schema, model } from 'mongoose'
import { genSalt, hash } from 'bcryptjs'
import { userTypes } from '../utilities/constants/types'
import deletePlugin from 'mongoose-delete'

interface UserInterface {
  fullName: string
  userType: string
  email: string
  phone: string
  password: string
  photo?: string
  token: string
  tokenExpiration: Date
}

const rounds = parseInt(process.env.BCRYPTJS_ROUNDS!)

const UserSchema = new Schema<UserInterface>(
  {
    fullName: {
      type: String,
      required: true
    },
    userType: {
      type: String,
      required: true,
      enum: userTypes,
      default: 'Admin'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String
      //required: true,
      //minlength: 8
    },
    photo: {
      type: String
    },
    token: String,
    tokenExpiration: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

UserSchema.plugin(deletePlugin)

UserSchema.pre('save', async function (next: any) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await genSalt(rounds)
    this.password = await hash(this.password, salt)
    return next()
  } catch (er: unknown) {
    return next(er)
  }
})

const User = model('User', UserSchema)
export default User
