import express from "express";
import { loginController, registerController } from "../controllers/auth";

const AuthRouter = express.Router();

AuthRouter.post("/register", registerController);
AuthRouter.post("/login", loginController);
AuthRouter.post("/logout");

export default AuthRouter;
