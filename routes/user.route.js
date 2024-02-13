import { Router } from 'express';
import bodyParser from 'body-parser';
import {
  changePassword,
  currentUser,
  deleteUser,
  editUser,
  getUsers,
  login,
  reset,
  setOrChangeRole,
  signup,
} from '../controllers/user.controller.js';
import { authenticate, superadminAuthenticate } from '../utils/auth.js';

const router = Router();
router.use(bodyParser.json());

router.get('/me', authenticate, currentUser);

router.get('/list', authenticate, getUsers);

router.post('/sign-up', superadminAuthenticate, signup);

router.post('/login', login);

router.put('/change-password', authenticate, changePassword);

router.put('/reset', reset);

router.put('/:email/edit', authenticate, editUser);

router.put('/:email/change-role', authenticate, setOrChangeRole);

router.delete('/delete', authenticate, deleteUser);

export default router;
