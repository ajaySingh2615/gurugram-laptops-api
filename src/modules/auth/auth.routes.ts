import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validateRequest } from '../../common/middlewares/validate-request.js';
import { loginSchema, refreshTokenSchema, registerSchema } from './dto/auth.dto.js';
import { requireAuth } from './middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  AuthController.createUserWithEmailAndPassword,
);

router.post('/login', validateRequest(loginSchema), AuthController.loginWithEmailAndPassword);

router.get('/me', requireAuth, (req, res) => {
  const userId = res.locals.user.id;

  res.json({
    success: true,
    message: 'you have accessed the VIP area',
    userId: userId,
  });
});

router.post('/refresh-token', AuthController.refreshToken);

router.post('/logout', requireAuth, AuthController.logout);

export const authRoutes: Router = router;
