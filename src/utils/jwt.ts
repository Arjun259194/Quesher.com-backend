import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export function newToken(payload: string | object | Buffer) {
  return jwt.sign(payload, JWT_SECRET);
}

export function validToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
