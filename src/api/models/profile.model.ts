import { Schema, model } from 'mongoose'

interface ProfileInterface {
  user: Schema.Types.ObjectId
  firstName: string
  lastName: string
  userType: string
  email: string
  phone: string
  photo?: string
  cv?: string
  address: string
  postalCode: string
  city: string
  country: string
  technologies: string[]
}

const ProfileSchema = new Schema<ProfileInterface>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    lastName: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    userType: {
      type: String,
      required: true
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
    address: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    technologies: [{
      type: String,
      required: true
    }],
    photo: {
      type: String
    },
    cv: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const Profile = model('Profile', ProfileSchema)
export default Profile

