import { verify } from 'jsonwebtoken'

export const verifyToken = (payload: any) => {
  return verify(payload, process.env.JWT_SECRET!)
}