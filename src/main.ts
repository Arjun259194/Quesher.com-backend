import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import z from 'zod';
import { ReqBodyParseWrapper } from './controllers/wrapper';
import { envParse } from './env';
import { authCheck } from './middleware/auth';
import RequestLogger from './middleware/log';
import AuthRouter from './routes/auth';
import UserRouter from './routes/user';
import MailService from './utils/email';

const server = express();

//env config
dotenv.config();
envParse();

//Middleware
server.use(json());
server.use(urlencoded({ extended: false }));
server.use(cors());
server.use(cookieParser());

// services
export const mailer = new MailService({
  pass: process.env.EMAIL_TOKEN,
  user: process.env.EMAIL_ADDRESS,
});

// *middleware used for debugging, not needed in production
server.use(RequestLogger);

//Router
server.use('/auth', AuthRouter);
server.use('/user', authCheck, UserRouter);

server.get('/health-check', (_, res) => {
  return res
    .status(200)
    .json({ message: `Server is running port: ${process.env.PORT}` });
});

// ?Routes and controllers created from here on are for testing and checking.
// ?Remove them before merging in the production or master branch

// !temp endpoint for mail testing
server.post(
  '/email',
  ReqBodyParseWrapper(
    z.object({
      email: z.string().email(),
      username: z.string(),
    }),
    async (req, res) => {
      await mailer.sendMail({
        type: 'Debug',
        email: req.body.email,
        message: [
          'This is a testing email sent for testing the email service created',
        ],
        username: req.body.username,
      });
      return res.status(200).send('mail sent');
    },
  ),
);

// ? Testing code ends here

server.listen(process.env.PORT, () =>
  console.log(`Server is running on port: ${process.env.PORT}`),
);

//TODO: Write rewrite auth endpoints for OTP auth
