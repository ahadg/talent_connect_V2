import { Application } from 'express';
import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth';
import { currentUserRoutes } from './routes/current-user';
import { authMiddleware } from './services/auth-middleware';
import { searchRoutes } from './routes/search';
import { buyerRoutes } from './routes/buyer';
import { sellerRoutes } from './routes/seller';
// import { gigRoutes } from './routes/gig';
// import { messageRoutes } from './routes/message';
// import { orderRoutes } from './routes/order';
// import { reviewRoutes } from './routes/review';

const BASE_PATH = '/api/gateway/v1';

export const appRoutes = (app: Application) => {
  app.use('', healthRoutes.routes());
  app.use(BASE_PATH, authRoutes.routes());
  app.use(BASE_PATH, searchRoutes.routes());

  app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, buyerRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, sellerRoutes.routes());
//   app.use(BASE_PATH, authMiddleware.verifyUser, gigRoutes.routes());
//   app.use(BASE_PATH, authMiddleware.verifyUser, messageRoutes.routes());
//   app.use(BASE_PATH, authMiddleware.verifyUser, orderRoutes.routes());
//   app.use(BASE_PATH, authMiddleware.verifyUser, reviewRoutes.routes());
};