import * as jwt from "jsonwebtoken";

export function newToken(payload: string | object | Buffer) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

export function validToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
