import client from "../database";
import { userLoginRequestBody, userRegisterRequestBody } from "../schemas/user";
import { checkPassword, hashPassword } from "../utils/hash";
import newToken from "../utils/jwt";
import { AwaitReqBodyParser } from "./wrapper";

export const registerController = AwaitReqBodyParser(
  userRegisterRequestBody,
  async (req, res) => {
    const { email, password, username } = req.body;
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

export const loginController = AwaitReqBodyParser(
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

    const token = newToken({ id: foundUser.id, email: foundUser.email });

    res.cookie("auth", token, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "user logged in",
      token: token,
    });
  }
);
