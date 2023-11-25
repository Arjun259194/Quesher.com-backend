import { Request, Response } from 'express';
import z from 'zod';
import Client from '../utils/database';
import MailService from '../utils/email';
import { HTTP_STATUS_CODE } from '../utils/status_code';
import {
  ReqBodyParseWrapper,
  ReqParamParseWrapper,
  TryCatchWrapper,
} from '../utils/wrapper';
import Controller from './controller';

export default class UserController extends Controller {
  constructor(c: Client, m: MailService) {
    super(c, m);
  }

  private GetUserParam = z.object({
    id: z.string(),
  });

  private UpdateReqBody = z.object({
    username: z.string(),
    email: z.string().email(),
    bio: z.string(),
  });

  GET = ReqParamParseWrapper(this.GetUserParam, async (req, res) => {
    const foundUser = await this.db.findUserById(req.params.id);
    const FAILED_ERROR_MESSAGE = { message: 'User not found' };
    if (!foundUser)
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(FAILED_ERROR_MESSAGE);
    const { password, ...user } = foundUser;

    const RESPONSE_MESSAGE = {
      message: 'User found',
      data: user,
    };

    return res.status(HTTP_STATUS_CODE.OK).json(RESPONSE_MESSAGE);
  });

  PROFILE = TryCatchWrapper(async (_: Request, res: Response) => {
    const foundUser = await this.db.findUserById(res.locals.userID);

    const FAILED_ERROR_MESSAGE = { message: 'User not found' };

    if (!foundUser)
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(FAILED_ERROR_MESSAGE);

    const { password, ...user } = foundUser;

    const RESPONSE_MESSAGE = {
      message: 'User found',
      data: user,
    };

    return res.status(HTTP_STATUS_CODE.OK).json(RESPONSE_MESSAGE);
  });

  UPDATE = ReqBodyParseWrapper(this.UpdateReqBody, async (req, res) => {
    const userID = res.locals.userID;
    const UPDATE_BODY = req.body;
    const updatedUser = await this.db.updateUser(userID, UPDATE_BODY);
    if (!updatedUser)
      return res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to update user' });
    const { password, ...user } = updatedUser;
    const RESPONSE_MESSAGE = { message: 'User data updated', data: user };
    return res.status(HTTP_STATUS_CODE.OK).json(RESPONSE_MESSAGE);
  });

  DELETE = TryCatchWrapper(async (_, res) => {
    const useID = res.locals.userID;
    const deletedUser = await this.db.deleteUser(useID);
    if (!deletedUser)
      return res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to delete user or user related data' });

    res.cookie('auth', '');

    return res
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: 'User and all user related data deleted successfully' });
  });
}
