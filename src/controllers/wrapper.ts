import { Request, Response } from "express";
import { z } from "zod";

/**
 * Wraps an Express route handler with a request body parser using a specified schema.
 *
 * @param schema - The schema used to validate and parse the request body.
 * @param callback - The route handler function that will be called if the request body is valid.
 * @returns An async function that handles Express requests, parsing and validating the request body before executing the route handler.
 */
export function ReqBodyParseWrapper<TReqBody>(
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

export function ReqQueryParseWrapper<TReqQuery>(
  schema: z.Schema<TReqQuery>,
  callback: (req: Request<any, any, any, TReqQuery>, res: Response) => void
) {
  return async (req: Request<any, any, any, TReqQuery>, res: Response) => {
    const parsedQuery = schema.safeParse(req.query);
    if (!parsedQuery.success) return res.status(400).send(parsedQuery.error.message);
    try {
      return callback(req, res);
    } catch (error) {
      return res.status(500).send(error);
    }
  };
}

export function TryCatchWrapper(callback: (req: Request, res: Response) => void) {
  return async (req: Request, res: Response) => {
    try {
      return callback(req, res);
    } catch (error) {
      return res.status(500).send(error);
    }
  };
}
