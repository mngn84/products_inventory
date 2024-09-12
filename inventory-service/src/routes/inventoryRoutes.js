import e, { Router } from 'express';
import * as inventoryController from '../controllers/inventoryController.js';

export const router = Router();

router.post('/', inventoryController.createInventory);
router.put('/:id/increase', inventoryController.increaseInventory);
router.put('/:id/decrease', inventoryController.decreaseInventory);
router.get('/', inventoryController.getInventory);
