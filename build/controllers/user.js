"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileController = void 0;
const userProfileController = (req, res) => {
    return res.status(200).json({ message: "This is user profile" });
};
exports.userProfileController = userProfileController;
