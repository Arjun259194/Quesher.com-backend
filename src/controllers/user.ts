import { Request, Response } from 'express';
import client from '../database';
import { TryCatchWrapper } from './wrapper';

export const userProfileController = TryCatchWrapper(
  async (_: Request, res: Response) => {
    const userID = res.locals.userID;
    const foundUser = await client.user.findUnique({ where: { id: userID } });
    if (!foundUser) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      message: 'User found',
      data: {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
      },
    });
  },
);
