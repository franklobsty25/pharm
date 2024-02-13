import { Router } from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../utils/auth.js';
import {
  createLocation,
  deleteLocation,
  editLocation,
  getLocation,
  getLocations,
} from '../controllers/location.controller.js';

const router = Router();
router.use(bodyParser.json());

router.get('/list', authenticate, getLocations);

router.get('/:location', authenticate, getLocation);

router.post('/create', authenticate, createLocation);

router.put('/:location/edit', authenticate, editLocation);

router.delete('/:location/delete', authenticate, deleteLocation);

export default router;
