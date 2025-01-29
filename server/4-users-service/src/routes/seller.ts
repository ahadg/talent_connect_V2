import { seller as createSeller } from '../controllers/seller/create';
import { id, random, username } from '../controllers/seller/get';
import { seed } from '../controllers/seller/seed';
import { seller as updateSeller } from '../controllers/seller/update';
import express, { Router } from 'express';

const router: Router = express.Router();

const sellerRoutes = (): Router => {
  router.get('/id/:sellerId', id);
  router.get('/username/:username', username);
  router.get('/random/:size', random);
  router.post('/create', createSeller);
  router.put('/:sellerId', updateSeller);
  router.put('/seed/:count', seed);
  

  return router;
};

export { sellerRoutes };