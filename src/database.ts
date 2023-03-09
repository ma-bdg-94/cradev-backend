/* eslint-disable  no-explicit-any */
import { connect, set } from 'mongoose'
const { MONGO_URI_DEV } = process.env

export const connectToMongoDB = async (): Promise<void> => {
  try {
    await connect(MONGO_URI_DEV!)
    console.info('Successfully connected to database!')
  } catch (er: any) {
    console.log(er.message)
    process.exit(1)
  }
}

set('strictQuery', true)
