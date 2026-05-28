import express, { type Application } from 'express';
import morgon from 'morgan';
import { healthRoutes } from '../modules/health/health.routes.js';
import { ApiError } from '../common/exceptions/api-error.js';
import { globalErrorHandler } from '../common/middlewares/error-handler.js';
import { authRoutes } from '../modules/auth/auth.routes.js';

export const buildApp = (): Application => {
  const app = express();

  app.use(express.json());

  app.use(morgon('dev'));

  app.use('/api/v1/health', healthRoutes);
  app.use('/api/v1/auth', authRoutes);

  app.use((req, res, next) => {
    next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
  });

  app.use(globalErrorHandler);

  return app;
};
