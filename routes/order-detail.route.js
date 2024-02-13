import { Router } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../utils/auth.js';
import {
  createOrderDetail,
  deleteOrderDetail,
  editOrderDetail,
  getOrderDetail,
  getOrderDetails,
  getProductHistory,
} from '../controllers/order-detail.controller.js';

const router = Router();
router.use(bodyParser.json());

router.get('/:detail', authenticate, getOrderDetail);

router.get('/:order/list', authenticate, getOrderDetails);

router.get('/product/history', authenticate, getProductHistory);

router.post('/:order/create/:product', authenticate, createOrderDetail);

router.put('/:detail/edit', authenticate, editOrderDetail);

router.delete('/:detail/delete', authenticate, deleteOrderDetail);

export default router;
