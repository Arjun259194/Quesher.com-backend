import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json, urlencoded } from "express";
import { authCheck } from "./middleware/auth";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/user";

const server = express();

//Config
const PORT = process.env.PORT || 3000;

//Middleware
server.use(json());
server.use(urlencoded({ extended: false }));
server.use(cors());
server.use(cookieParser());

//Router
server.use("/auth", AuthRouter);
server.use("/user", authCheck, UserRouter);

server.get("/health-check", (req, res) => {
  return res.status(200).json({ message: `Server is running port: ${PORT}` });
});

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
