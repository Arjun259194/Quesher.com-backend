import { Request, Response } from "express";
import { z } from "zod";

export function AwaitReqBodyParser<TReqBody>(
  schema: z.Schema<TReqBody>,
  callback: (req: Request<any, any, TReqBody, any>, res: Response) => void
) {
  return async (req: Request<any, any, TReqBody, any>, res: Response) => {
    const parsedBody = schema.safeParse(req.body);
    if (!parsedBody.success) return res.status(400).send(parsedBody.error.message);
    try {
      return callback(req, res);
    } catch (error) {
      return res.status(500).send(error);
    }
  };
}

export function AwaitTryCatchWrapper(callback: (req: Request, res: Response) => void) {
  return async (req: Request, res: Response) => {
    try {
      return callback(req, res);
    } catch (error) {
      return res.status(500).send(error);
    }
  };
}
