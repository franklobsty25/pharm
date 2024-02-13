import { Router } from 'express';
import bodyParser from 'body-parser';
import { createProductStock, stockProduct } from '../controllers/stock.controller.js';

const router = Router();
router.use(bodyParser.json());

router.get('/stock', stockProduct);
router.post('/:product/create', createProductStock);

export default router;
