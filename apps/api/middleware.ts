import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = jwt.verify(token, process.env.JWT_PUBLIC_CLERK_KEY!);
  if (!decoded || !decoded.sub) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = decoded.sub as string;
  next();
}
