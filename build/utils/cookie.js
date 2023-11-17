"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCookie = exports.createNewCookie = void 0;
function createNewCookie(token, res) {
    return res.cookie("auth", token, {
        httpOnly: true,
        maxAge: 259200000, // 3 days in milliseconds (3 * 24 * 60 * 60 * 1000)
    });
}
exports.createNewCookie = createNewCookie;
function removeCookie() { }
exports.removeCookie = removeCookie;
