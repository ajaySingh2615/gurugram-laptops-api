import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export class JwtUtil {
  public static generateAccessToken(userId: string) {
    return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  }

  public static generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  public static verifyRefreshToken(token: string) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
  }
}
