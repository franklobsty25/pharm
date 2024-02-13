import { Router } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../utils/auth.js';
import {
  createOrder,
  deleteOrder,
  editOrder,
  getOrder,
  getOrders,
} from '../controllers/order.controller.js';

const router = Router();
router.use(bodyParser.json());

router.get('/list', authenticate, getOrders);

router.get('/:order', authenticate, getOrder);

router.post('/:customer/create', authenticate, createOrder);

router.put('/:order/edit', authenticate, editOrder);

router.delete('/:order/delete', authenticate, deleteOrder);

export default router;
