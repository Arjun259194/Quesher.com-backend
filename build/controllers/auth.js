"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.registerController = void 0;
const database_1 = __importDefault(require("../database"));
const user_1 = require("../schemas/user");
const hash_1 = require("../utils/hash");
const jwt_1 = __importDefault(require("../utils/jwt"));
const wrapper_1 = require("./wrapper");
exports.registerController = (0, wrapper_1.AwaitReqBodyParser)(user_1.userRegisterRequestBody, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    const newUser = yield database_1.default.user.create({
        data: {
            email,
            username,
            password: yield (0, hash_1.hashPassword)(password),
        },
    });
    return res.status(200).json({
        message: "New user registered in database",
        user: {
            username: newUser.username,
            email: newUser.email,
        },
    });
}));
exports.loginController = (0, wrapper_1.AwaitReqBodyParser)(user_1.userLoginRequestBody, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield database_1.default.user.findUnique({
        where: {
            email: req.body.email,
        },
    });
    if (!foundUser)
        return res.status(404).json({
            message: "No User found",
        });
    const isValidPassword = (0, hash_1.checkPassword)(req.body.password, foundUser.password);
    if (!isValidPassword)
        return res.status(401).json({ message: "Wrong password, user not authorized" });
    const token = (0, jwt_1.default)({ id: foundUser.id, email: foundUser.email });
    res.cookie("auth", token, {
        httpOnly: true,
    });
    return res.status(200).json({
        message: "user logged in",
        token: token,
    });
}));
