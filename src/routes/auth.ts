import express from "express";

const AuthRouter = express.Router();

AuthRouter.post("/register");
AuthRouter.post("/login");
AuthRouter.post("/logout");
