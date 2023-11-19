import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import z from "zod";
import { ReqBodyParseWrapper } from "./controllers/wrapper";
import { envParse } from "./env";
import { authCheck } from "./middleware/auth";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/user";
import MailService from "./utils/email";

const server = express();

//env config
dotenv.config();
envParse();

export const mailer = new MailService({
  pass: process.env.EMAIL_TOKEN,
  user: process.env.EMAIL_ADDRESS,
});

//Middleware
server.use(json());
server.use(urlencoded({ extended: false }));
server.use(cors());
server.use(cookieParser());

//Router
server.use("/auth", AuthRouter);
server.use("/user", authCheck, UserRouter);

server.get("/health-check", (_, res) => {
  return res.status(200).json({ message: `Server is running port: ${process.env.PORT}` });
});

// temp endpoint for mail checking
server.post(
  "/email",
  ReqBodyParseWrapper(
    z.object({
      email: z.string().email(),
      username: z.string(),
    }),
    async (req, res) => {
      await mailer.sendMail({
        userEmail: req.body.email,
        genUrl: "https://www.youtube.com/watch?v=tybdfQJm2d8&ab_channel=euphoricnight",
        username: req.body.username,
      });
      // .catch(error => {
      //   return res.status(400).send("failed to send the mail");
      // });

      return res.status(200).send("mail sent");
    }
  )
);

server.listen(process.env.PORT, () =>
  console.log(`Server is running on port: ${process.env.PORT}`)
);
