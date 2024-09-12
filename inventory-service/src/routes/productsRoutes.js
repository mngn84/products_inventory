import { Router } from 'express';
import * as productsController from '../controllers/productsController.js';

export const router = Router();

router.post('/', productsController.createProduct);
router.get('/', productsController.getProducts);
