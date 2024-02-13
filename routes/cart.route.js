import { Router } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../utils/auth.js';
import {
  createCustomerCart,
  getCustomerCarts,
  getCustomerGrandTotal,
} from '../controllers/cart.controller.js';

const router = Router();
router.use(bodyParser.json());

router.get('/:customer', authenticate, getCustomerCarts);

router.get('/:customer/pay', authenticate, getCustomerGrandTotal);

router.post('/:customer/create', authenticate, createCustomerCart);

export default router;
