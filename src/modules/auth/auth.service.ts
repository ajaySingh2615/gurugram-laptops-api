import { ApiError } from '../../common/exceptions/api-error.js';
import type { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto.js';
import { UserRepository } from './user.repository.js';
import { PasswordUtil } from '../../common/utils/password.util.js';
import { JwtUtil } from '../../common/utils/jwt.util.js';

export class AuthService {
  public static async createUserWithEmailAndPassword(data: RegisterDto) {
    const existingUser = await UserRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(400, 'A user with this email already exists');
    }

    const hashedPassword = await PasswordUtil.hash(data.password);

    const newUser = await UserRepository.insertUser({
      ...data,
      password: hashedPassword,
    });

    return {
      id: newUser?.id,
      fullName: newUser?.fullName,
      email: newUser?.email,
      createdAt: newUser?.createdAt,
    };
  }

  public static async loginWithEmailAndPassword(data: LoginDto) {
    const user = await UserRepository.findUserByEmail(data.email);
    if (!user || !user.password) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await PasswordUtil.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const accessToken = JwtUtil.generateAccessToken(user.id);
    const refreshToken = JwtUtil.generateRefreshToken(user.id);

    await UserRepository.updateUser(user.id, { refreshToken, updatedAt: new Date() });

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  public static async refreshToken(data: RefreshTokenDto) {
    let decoded;
    try {
      decoded = JwtUtil.verifyRefreshToken(data.refreshToken);
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    // find the user
    const user = await UserRepository.findUserById(decoded.userId);

    // security check: does the token match the database
    if (!user || user.refreshToken !== data.refreshToken) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    // Generate new tokens (This is called Refresh Token Rotation)
    const newAccessToken = JwtUtil.generateAccessToken(user.id);
    const newRefreshToken = JwtUtil.generateRefreshToken(user.id);

    // save the new token in the DB
    await UserRepository.updateUser(user.id, {
      refreshToken: newRefreshToken,
      updatedAt: new Date(),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  public static async logout(userId: string) {
    // We just wipe the refresh token from the database!
    await UserRepository.updateUser(userId, {
      refreshToken: null,
      updatedAt: new Date(),
    });

    return true;
  }
}
