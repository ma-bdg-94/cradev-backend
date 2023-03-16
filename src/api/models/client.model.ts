import { Schema, model } from 'mongoose'

interface ClientInterface {
  user: Schema.Types.ObjectId
  fullName: string
  service: string
  serviceCode?: string
  clientType: string
  email: string
  phone: string
  logo?: string
  address: string
  postalCode: string
  city: string
  country: string
}

const ClientSchema = new Schema<ClientInterface>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    fullName: {
      type: String,
      required: true
    },
    service: {
      type: String,
      required: true
    },
    serviceCode: {
      type: String,
    },
    clientType: {
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
    logo: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const Client = model('Client', ClientSchema)
export default Client

