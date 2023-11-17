import { Request, Response } from "express";
import { z } from "zod";

export function AwaitReqBodyParser<TReqBody>(
  schema: z.Schema<TReqBody>,
  callback: (req: Request<any, any, TReqBody, any>, res: Response) => void
) {
  return async (req: Request<any, any, TReqBody, any>, res: Response) => {
    const parsedBody = schema.safeParse(req.body);
    if (!parsedBody.success) return res.status(400).send(parsedBody.error.message);
    return await callback(req, res);
  };
}
