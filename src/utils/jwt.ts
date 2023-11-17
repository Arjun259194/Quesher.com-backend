import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export default function newToken(payload: { id: string; email: string }) {
  return sign(payload, JWT_SECRET, { expiresIn: "3d" });
}
