import express from "express";
import { userProfileController } from "../controllers/user";

const UserRoutes = express.Router();

UserRoutes.get("/profile", userProfileController);

export default UserRoutes;
