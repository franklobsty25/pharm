import { Router } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../utils/auth.js';
import {
  createSupplier,
  deleteSupplier,
  editSupplier,
  getSupplier,
  getSuppliers,
} from '../controllers/supplier.controller.js';

const router = Router();
router.use(bodyParser.json());

router.get('/list', authenticate, getSuppliers);

router.get('/:supplier', authenticate, getSupplier);

router.post('/create', authenticate, createSupplier);

router.put('/:supplier/edit', authenticate, editSupplier);

router.delete('/:supplier/delete', authenticate, deleteSupplier);

export default router;
