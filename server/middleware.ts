import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
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

const getTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.cookie?.split('=')[1];
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
