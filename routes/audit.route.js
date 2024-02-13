import { Router } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../utils/auth.js';
import {
  getAuditLogs,
  createAuditLog,
} from '../controllers/audit.controller.js';

const router = Router();
router.use(bodyParser.json());

router.get('/list', authenticate, getAuditLogs);

router.post('/create', authenticate, createAuditLog);

export default router;
