import { Router } from 'express';
import * as productsRoutes from './productsRoutes.js';
import * as inventoryRoutes from './inventoryRoutes.js';
import {publishEvent} from '../utils/rmq.js';

const router = Router();

router.use('/products', productsRoutes.router);
router.use('/inventory', inventoryRoutes.router);

export default router;

