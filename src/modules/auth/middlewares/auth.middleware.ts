import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../common/config/env.js';
import { ApiError } from '../../../common/exceptions/api-error.js';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access denied. No token provided');
    }

    // 3. Extract the actual token (Split "Bearer eyJhbG..." by the space)
    const token = authHeader.split(' ')[1]!;

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
