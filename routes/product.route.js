import { Router } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../utils/auth.js';
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProducts,
} from '../controllers/product.controller.js';

const router = Router();
router.use(bodyParser.json());

router.get('/list', authenticate, getProducts);

router.get('/:product', authenticate, getProduct);

router.post('/:supplier/create', authenticate, createProduct);

router.put('/:product/edit', authenticate, editProduct);

router.delete('/:product/delete', authenticate, deleteProduct);

export default router;
