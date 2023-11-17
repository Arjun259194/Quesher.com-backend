import { Handler } from "express";

export const userProfileController: Handler = (req, res) => {
  return res.status(200).json({ message: "This is user profile" });
};
