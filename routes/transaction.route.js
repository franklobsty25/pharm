import { Router } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../utils/auth.js';
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  getTransaction,
  getTransactions,
  getDashboardOverview,
} from '../controllers/transaction.controller.js';

const router = Router();
router.use(bodyParser.json());

router.get('/list', authenticate, getTransactions);

router.get('/:transaction', authenticate, getTransaction);

router.get('/dashboard/overview', authenticate, getDashboardOverview);

router.post('/:order/create', authenticate, createTransaction);

router.put('/:transaction/edit', authenticate, editTransaction);

router.delete('/:transaction/delete', authenticate, deleteTransaction);

export default router;
