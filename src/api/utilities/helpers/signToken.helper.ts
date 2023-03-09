import { sign } from 'jsonwebtoken'

export const signToken = (payload: any) => {
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