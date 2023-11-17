"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const AuthRouter = express_1.default.Router();
AuthRouter.post("/register", auth_1.registerController);
AuthRouter.post("/login", auth_1.loginController);
AuthRouter.post("/logout");
exports.default = AuthRouter;
