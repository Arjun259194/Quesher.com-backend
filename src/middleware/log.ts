import { NextFunction, Request, Response } from 'express';

export default async function RequestLogger(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { method, originalUrl, body, query, params, headers, ip } = req;

  console.log(`\nIncoming Request Log:`);
  console.log(`IP: ${ip}`);
  console.log(`Method: ${method}`);
  console.log(`Path: ${originalUrl}`);
  console.log(`Query Parameters: ${JSON.stringify(query)}`);
  console.log(`Request Parameters: ${JSON.stringify(params)}`);
  console.log(`Request Body: ${JSON.stringify(body)}`);
  console.log(`Headers: ${JSON.stringify(headers)}`);
  console.log('-----------------------------');

  next();
}
