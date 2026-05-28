import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { ApiResponse } from '../../common/utils/api-response.js';

export class AuthController {
  public static createUserWithEmailAndPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const newUser = await AuthService.createUserWithEmailAndPassword(req.body);
      return ApiResponse.created(res, 'User registerd successfully', newUser);
    } catch (error) {
      next(error);
    }
  };

  public static loginWithEmailAndPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = await AuthService.loginWithEmailAndPassword(req.body);
      return ApiResponse.success(res, 'Login successful', data);
    } catch (error) {
      next(error);
    }
  };

  public static refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await AuthService.refreshToken(req.body);
      return ApiResponse.success(res, 'Token refreshed successfully', tokens);
    } catch (error) {
      next(error);
    }
  };

  public static logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      await AuthService.logout(userId);

      return ApiResponse.success(res, 'Logged out successfully', null);
    } catch (error) {
      next(error);
    }
  };
}
