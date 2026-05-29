import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../common/utils/api-response.js';
import { UserRepository } from '../auth/user.repository.js';
import { ApiError } from '../../common/exceptions/api-error.js';

export class AdminController {
  public static getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserRepository.getAllUsers();
      return ApiResponse.success(res, 'Users fetched successfully', users);
    } catch (error) {
      next(error);
    }
  };

  public static updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const { role } = req.body;

      if (!role || !['USER', 'ADMIN'].includes(role)) {
        throw new ApiError(400, 'Invalid role');
      }

      const updatedUser = await UserRepository.updateUser(id, { role, updatedAt: new Date() });
      if (!updatedUser) throw new ApiError(404, 'User not found');

      return ApiResponse.success(res, 'User role updated successfully', null);
    } catch (error) {
      next(error);
    }
  };

  public static updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      if (!status || !['ACTIVE', 'BANNED'].includes(status)) {
        throw new ApiError(400, 'Invalid status');
      }

      const updatedUser = await UserRepository.updateUser(id, { status, updatedAt: new Date() });
      if (!updatedUser) throw new ApiError(404, 'User not found');

      return ApiResponse.success(res, 'User status updated successfully', null);
    } catch (error) {
      next(error);
    }
  };
}
