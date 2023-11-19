import client from "../database";
import { otpQuery, userLoginRequestBody, userRegisterRequestBody } from "../schemas/auth";
import { checkPassword, hashPassword } from "../utils/hash";
import { newToken } from "../utils/jwt";
import { ReqBodyParseWrapper, ReqQueryParseWrapper } from "./wrapper";

export const registerController = ReqBodyParseWrapper(
  userRegisterRequestBody,
  async (req, res) => {
    const { email, password, username } = req.body;

    const foundUser = await client.user.findUnique({
      where: {
        email: email,
      },
    });

    if (foundUser) return res.status(400).json({ message: "User already existing" });

    const newUser = await client.user.create({
      data: {
        email,
        username,
        password: await hashPassword(password),
      },
    });

    return res.status(200).json({
      message: "New user registered in database",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  }
);

export const loginController = ReqBodyParseWrapper(
  userLoginRequestBody,
  async (req, res) => {
    const foundUser = await client.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!foundUser)
      return res.status(404).json({
        message: "No User found",
      });

    const isValidPassword = checkPassword(req.body.password, foundUser.password);

    if (!isValidPassword)
      return res.status(401).json({ message: "Wrong password, user not authorized" });

    const token = newToken(foundUser.id);

    res.cookie("auth", token, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "user logged in",
      token: token,
    });
  }
);

export const OTPController = ReqQueryParseWrapper(otpQuery, async (req, res) => {});
