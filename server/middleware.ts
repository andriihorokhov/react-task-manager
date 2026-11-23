import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { Prisma } from '../prisma/generated/client.ts';
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  skip: () => {
    return process.env.npm_lifecycle_event === 'test'
      ? true
      : (false as boolean);
  },
});

export const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  limiter(req, res, next);
};

const getErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      message: 'Invalid request body',
    });
    return;
  }
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2002'
  ) {
    res.status(409).json({
      error: 'Database error',
      message: 'Email already exists',
    });
    return;
  }
  res.status(500).json({
    error: 'Internal server error',
    message: 'Internal server error',
  });
  return;
};

const getTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.cookie
    ?.split('; ')
    .find((cookie) => cookie.startsWith('token='))
    ?.split('=')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    (req as Request & { user?: { userId?: number } }).user = decoded as {
      userId?: number;
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export { getErrorMiddleware, getTokenMiddleware };
