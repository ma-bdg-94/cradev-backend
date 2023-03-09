import { Request, Response, NextFunction } from 'express';
import { verify, VerifyErrors } from 'jsonwebtoken';

interface DecodedToken {
  user: string;
  iat: number;
  exp: number;
}

export default function isAuth(req: Request, res: Response, next: NextFunction): any {
  const token = req.header('x-auth-token');

  if (!token) {
    return res
      .status(401)
      .json({ msg: 'Token not found or invalid! Access denied' });
  }

  try {
    const decryptedToken = verify(token, process.env.JWT_SECRET!) as DecodedToken;
    (req as any).user = decryptedToken.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token not found or invalid! Access denied' });
  }
}
