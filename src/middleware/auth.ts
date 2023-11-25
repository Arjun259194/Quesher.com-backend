import { NextFunction, Request, Response } from 'express';
import { validToken } from '../utils/jwt';

export default function authCheck(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.cookies['auth'];

  if (!authToken)
    return res
      .status(401) // Unauthorized user
      .json({ message: 'Token not found. User may not be authorized' });

  const payloadId = validToken(authToken);

  if (!payloadId || payloadId === '')
    return res.status(401).json({ message: 'User not authorized' });

  res.locals.userID = payloadId;

  next();
}
