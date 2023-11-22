import client from '../database';
import { mailer } from '../main';
import {
  otpQuery,
  userLoginRequestBody,
  userRegisterRequestBody,
} from '../schemas/auth';
import { genRandOtpCode } from '../utils/auth';
import { findLatestOptByEmail, findUserByEmail } from '../utils/database';
import { checkPassword, hashPassword } from '../utils/hash';
import { newToken } from '../utils/jwt';
import { ReqBodyParseWrapper, ReqQueryParseWrapper } from './wrapper';

export const registerController = ReqBodyParseWrapper(
  userRegisterRequestBody,
  async (req, res) => {
    const { email, password, username } = req.body;

    const foundUser = await findUserByEmail(client, email);

    if (foundUser)
      return res.status(400).json({
        message: 'User already existing',
      });

    const newUser = await client.user.create({
      data: {
        email,
        username,
        password: await hashPassword(password),
      },
    });

    return res.status(200).json({
      message: 'New user registered in database',
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  },
);

export const loginController = ReqBodyParseWrapper(
  userLoginRequestBody,
  async (req, res) => {
    const foundUser = await findUserByEmail(client, req.body.email);

    if (!foundUser)
      return res.status(404).json({
        message: 'No User found',
      });

    const isValidPassword = checkPassword(
      req.body.password,
      foundUser.password,
    );

    if (!isValidPassword)
      return res.status(401).json({
        message: 'Wrong password, user not authorized',
      });

    const OTP = await client.otp.create({
      data: {
        code: genRandOtpCode(),
        userId: foundUser.id,
      },
    });

    try {
      await mailer.sendMail({
        type: 'OTP',
        email: foundUser.email,
        username: foundUser.username,
        code: OTP.code,
      });

      return res.status(200).json({
        message:
          'Email with verification code send to your email. check inbox of ' +
          foundUser.email,
      });
    } catch (err) {
      return res.status(500).json({
        message: 'failed to send OTP email',
        error: err,
      });
    }
  },
);

export const OTPController = ReqQueryParseWrapper(
  otpQuery,
  async (req, res) => {
    const otp = await findLatestOptByEmail(client, req.body.query);

    if (!otp)
      return res.status(404).json({
        message: 'authentication code not registered in the records',
      });

    if (otp.code !== Number(req.query.code))
      return res.status(400).json({
        message: 'Authentication code not matched',
      });

    const token = newToken(otp.User.id);

    res.cookie('auth', token);

    return res.status(200).json({ message: 'User logged in' });
  },
);
