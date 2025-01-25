import { Application } from 'express';
import { authRoutes } from './routes/auth';
//import express, { Router } from 'express';
import { verifyGatewayRequest } from './gateway-middleware';
import { currentUserRoutes } from './routes/current-user';

// import { currentUserRoutes } from '@auth/routes/current-user';
import { healthRoutes } from './routes/health';
// import { searchRoutes } from '@auth/routes/search';
// import { seedRoutes } from '@auth/routes/seed';

const BASE_PATH = '/api/v1/auth';
//const router: Router = express.Router();
export function appRoutes(app: Application): void {
   app.use('', healthRoutes());
//   app.use(BASE_PATH, searchRoutes());
//   app.use(BASE_PATH, seedRoutes());
// app.use(router.post('/', () => {
//   console.log("request_recieved")
// }))
  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());
};