"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
function newToken(payload) {
    return (0, jsonwebtoken_1.sign)(payload, config_1.JWT_SECRET, { expiresIn: "3d" });
}
exports.default = newToken;
