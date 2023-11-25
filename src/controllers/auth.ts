import z from 'zod';
import Client from '../utils/database';
import MailService from '../utils/email';
import { checkPassword } from '../utils/hash';
import { newToken } from '../utils/jwt';
import { HTTP_STATUS_CODE } from '../utils/status_code';
import { ReqBodyParseWrapper, ReqQueryParseWrapper } from '../utils/wrapper';
import Controller from './controller';

export default class AuthController extends Controller {
  constructor(db: Client, m: MailService) {
    super(db, m);
  }

  private RegisterReqBody = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    bio: z.string(),
  });

  private LoginReqBody = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  private OTPQuery = z.object({
    email: z.string().email(),
    code: z.string().min(6).max(6),
  });

  REGISTER = ReqBodyParseWrapper(this.RegisterReqBody, async (req, res) => {
    const { email, password, username, bio } = req.body;

    const foundUser = await this.db.findUserByEmail(email);

    if (foundUser)
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'User already existing',
      });

    const newUser = await this.db.createNewUser(email, username, password, bio);

    const RESPONSE_MESSAGE = {
      message: 'New user registered in database',
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    };

    return res.status(HTTP_STATUS_CODE.OK).json(RESPONSE_MESSAGE);
  });

  LOGIN = ReqBodyParseWrapper(this.LoginReqBody, async (req, res) => {
    const foundUser = await this.db.findUserByEmail(req.body.email);

    if (!foundUser)
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: 'No User found',
      });

    const isValidPassword = checkPassword(
      req.body.password,
      foundUser.password,
    );

    if (!isValidPassword)
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        message: 'Wrong password, user not authorized',
      });

    const OTP = await this.db.createNewOPT(foundUser.id);

    try {
      await this.mail.sendMail({
        type: 'OTP',
        email: foundUser.email,
        username: foundUser.username,
        code: OTP.code,
      });

      return res.status(HTTP_STATUS_CODE.OK).json({
        message:
          'Email with verification code send to your email. check inbox of ' +
          foundUser.email,
      });
    } catch (err) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: 'failed to send OTP email',
        error: err,
      });
    }
  });

  OPT = ReqQueryParseWrapper(this.OTPQuery, async (req, res) => {
    const otp = await this.db.findLatestOptByEmail(req.query.email);

    if (!otp)
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: 'authentication code not registered in the records',
      });

    if (otp.code !== Number(req.query.code))
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: 'Authentication code not matched',
      });

    const token = newToken(otp.User.id);

    res.cookie('auth', token);

    return res.status(HTTP_STATUS_CODE.OK).json({ message: 'User logged in' });
  });
}

// export const registerController = ReqBodyParseWrapper(
//   userRegisterRequestBody,
//   async (req, res) => {
//     const { email, password, username } = req.body;

//     const client = new Client(prismaGlobalClient);

//     const foundUser = await client.findUserByEmail(email);

//     if (foundUser)
//       return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
//         message: 'User already existing',
//       });

//     const newUser = await client.createNewUser(email, username, password);

//     const RESPONSE_MESSAGE = {
//       message: 'New user registered in database',
//       user: {
//         username: newUser.username,
//         email: newUser.email,
//       },
//     };

//     return res.status(HTTP_STATUS_CODE.OK).json(RESPONSE_MESSAGE);
//   },
// );

// export const loginController = ReqBodyParseWrapper(
//   userLoginRequestBody,
//   async (req, res) => {
//     const client = new Client(prismaGlobalClient);
//     const foundUser = await client.findUserByEmail(req.body.email);

//     if (!foundUser)
//       return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
//         message: 'No User found',
//       });

//     const isValidPassword = checkPassword(
//       req.body.password,
//       foundUser.password,
//     );

//     if (!isValidPassword)
//       return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
//         message: 'Wrong password, user not authorized',
//       });

//     const OTP = await client.createNewOPT(foundUser.id);

//     try {
//       await mailer.sendMail({
//         type: 'OTP',
//         email: foundUser.email,
//         username: foundUser.username,
//         code: OTP.code,
//       });

//       return res.status(HTTP_STATUS_CODE.OK).json({
//         message:
//           'Email with verification code send to your email. check inbox of ' +
//           foundUser.email,
//       });
//     } catch (err) {
//       return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
//         message: 'failed to send OTP email',
//         error: err,
//       });
//     }
//   },
// );

// export const OTPController = ReqQueryParseWrapper(
//   otpQuery,
//   async (req, res) => {
//     const client = new Client(prismaGlobalClient);
//     const otp = await client.findLatestOptByEmail(req.body.query);

//     if (!otp)
//       return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
//         message: 'authentication code not registered in the records',
//       });

//     if (otp.code !== Number(req.query.code))
//       return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
//         message: 'Authentication code not matched',
//       });

//     const token = newToken(otp.User.id);

//     res.cookie('auth', token);

//     return res.status(HTTP_STATUS_CODE.OK).json({ message: 'User logged in' });
//   },
// );
