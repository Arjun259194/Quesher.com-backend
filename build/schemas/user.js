"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginRequestBody = exports.userRegisterRequestBody = void 0;
const zod_1 = require("zod");
exports.userRegisterRequestBody = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.userLoginRequestBody = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
