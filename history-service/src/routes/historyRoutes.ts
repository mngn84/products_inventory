import { Router } from 'express';
import * as historyController from '../controllers/historyController';

const router: Router = Router();

router.get('/history', historyController.getHistory);

export default router