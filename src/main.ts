import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import { envParse } from "./env";
import { authCheck } from "./middleware/auth";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/user";

const server = express();

//env config
dotenv.config();
envParse();

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

server.listen(process.env.PORT, () =>
  console.log(`Server is running on port: ${process.env.PORT}`)
);
