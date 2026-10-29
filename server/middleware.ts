import type { NextFunction, Request, Response } from 'express';
const getErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    error: err.name,
    message: err.message,
  });
  console.error(err);
  next(err);
};

export { getErrorMiddleware };
