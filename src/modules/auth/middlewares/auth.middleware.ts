import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../common/config/env.js';
import { ApiError } from '../../../common/exceptions/api-error.js';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get the token from cookies (or fallback to header for Postman testing)
    const token = 
      req.cookies.accessToken || 
      (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : undefined);

    if (!token) {
      throw ApiError.unauthorized('Access denied. No token provided');
    }

    // 4. Verify the token using our secret
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as { userId: string };

    // 5. Attach the payload to `res.locals` so the Controller can read it!
    res.locals.user = { id: decoded.userId };

    // 6. Move to the next middleware or controller
    next();
  } catch (error) {
    // If jwt.verify fails (e.g., token is expired or fake), it throws an error.
    next(ApiError.unauthorized('Invalid or expired token.'));
  }
};
