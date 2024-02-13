import jwt from 'jsonwebtoken';
import { ResponseService } from './response.service.js';
import 'dotenv/config';
import { PaginateUserModel } from '../models/user.model.js';
import { RolesEnum } from '../constants/constant.js';

const getToken = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '24h' });
};

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!decoded) {
      ResponseService.json(res, 401, 'Unathorized access');
      return;
    }

    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const superadminAuthenticate = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      if (!decoded) return ResponseService.json(res, 401, 'Unathorized access');

      const user = await PaginateUserModel.findOne({
        _id: decoded.id,
        email: decoded.email,
        isDeleted: { $ne: true },
      }).select('-password');
      
      if (![RolesEnum.SUPERADMIN, RolesEnum.ADMIN].includes(user.role))
        return ResponseService.json(res, 403, 'Forbidden resource');

      req.user = user;
      next();
    } catch (error) {
      ResponseService.json(res, error);
    }
  } else {
    next();
  }
};

export { getToken, authenticate, superadminAuthenticate };
