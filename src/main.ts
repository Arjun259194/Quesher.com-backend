import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import os from 'os';
import z from 'zod';
import prismaGlobalClient from './database';
import { envParse } from './env';
import RequestLogger from './middleware/log';
import AuthRouter from './routes/auth';
import UserRouter from './routes/user';
import Client from './utils/database';
import MailService from './utils/email';
import { ReqBodyParseWrapper } from './utils/wrapper';

const server = express();

////  Create a Controller class and centralize the controllers
// TODO: Add an env for production or not and set debugging settings only if not in production

//env config
dotenv.config();
envParse();

//Global Middleware
server.use(json());
server.use(urlencoded({ extended: false }));
server.use(cors());
server.use(cookieParser());

// services
const mailer = new MailService({
  pass: process.env.EMAIL_TOKEN,
  user: process.env.EMAIL_ADDRESS,
});

const database = new Client(prismaGlobalClient);

// *middleware used for debugging, not needed in production
server.use(RequestLogger);

// *health-check router for checking if server is active or not
server.get('/health-check', (_, res) => {
  const serverInfo = {
    appName: 'Your App Name',
    status: 'UP',
    serverTime: new Date().toISOString(),
    serverInfo: {
      platform: os.platform(),
      architecture: os.arch(),
      cpus: os.cpus(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
    },
  };
  return res.status(200).json({
    message: `Server is running port: ${process.env.PORT}`,
    health: serverInfo,
  });
});

//Router
const authRouter = new AuthRouter(database, mailer);
const userRouter = new UserRouter(database, mailer);

authRouter.SetRouter(server);
userRouter.SetRouter(server);

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
