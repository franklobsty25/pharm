import * as argon2 from 'argon2';
import { PaginateUserModel } from '../models/user.model.js';
import {
  changePasswordSchema,
  editSchema,
  loginSchema,
  resetSchema,
  setRoleSchema,
  signupSchema,
} from '../schemas/user.schemas.js';
import { ResponseService } from '../utils/response.service.js';
import { getToken } from '../utils/auth.js';
import { createAuditLog } from './audit.controller.js';
import lodash from 'lodash';

const currentUser = async (req, res) => {
  const { user } = req;
  const { u } = req.query;
  
  const query = {
    isDeleted: { $ne: true },
  };

  if (u) {
    if (u.includes('@')) {
      query.email = u;
    } else {
      query._id = u;
    }
  } else {
    query._id = user.id;
  }

  const _user = await PaginateUserModel.findOne(query).select('-password');

  ResponseService.json(res, 200, 'User retrieved successfully.', _user);
};

const getUsers = async (req, res) => {
  const data = await PaginateUserModel.find({ isDeleted: { $ne: true } });

  const users = data.map((user) => {
    return {
      id: user.id,
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      phonenumber: user.phoneNumber,
      email: user.email,
      role: user.role,
    };
  });

  res.json({ data: users });
};

const signup = async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    if (value) {
      const { password, repeatPassword } = value;

      if (password !== repeatPassword) {
        return ResponseService.json(res, 400, 'Password mismatch.');
      }

      value.password = await argon2.hash(value.password);
      const user = await PaginateUserModel.create(value);
      const token = getToken({ id: user.id, email: user.email });

      if (req.user)
        createAuditLog({
          creator: req.user.id,
          message: `<a href="edit?email=${value.email}">${value.email}</a> created user account.`,
          metadata: user,
        });

      ResponseService.json(res, 201, 'User created successfully.', { token });
    }
  } catch (error) {
    if (error.code == 11000)
      return ResponseService.json(
        res,
        400,
        `${error.keyValue.email || error.keyValue.phoneNumber} already exists.`
      );

    ResponseService.json(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const { email, password } = value;
    const user = await PaginateUserModel.findOne({
      email,
      isDeleted: { $ne: true },
    });

    if (!user) {
      return ResponseService.json(res, 400, `User with ${email} not found.`);
    }

    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      return ResponseService.json(res, 401, 'Password invalid.');
    }

    const token = getToken({ id: user.id, email: user.email });
    const _user = lodash.pick(user, ['firstname', 'lastname', 'email', 'role']);

    ResponseService.json(res, 200, 'User logged in successfully.', {
      user: _user,
      token,
    });
  } catch (error) {
    console.log('Error message: ' + error);
    ResponseService.json(res, error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    const { user } = req;

    if (error) return ResponseService.json(res, error);

    const { oldPassword, newPassword, repeatPassword } = value;

    if (newPassword !== repeatPassword) {
      return ResponseService.json(res, 400, 'Password mismatch.');
    }

    const userDoc = await PaginateUserModel.findOne({
      _id: user.id,
      isDeleted: { $ne: true },
    });

    createAuditLog({
      creator: user.id,
      message: `Account with <a href="${user.email}">${user.email}</a> changed password.`,
      metadata: userDoc,
    });

    if (!user) {
      return ResponseService.json(
        res,
        400,
        'User not found for password changes.'
      );
    }

    const isValid = await argon2.verify(userDoc.password, oldPassword);

    if (!isValid) {
      return ResponseService.json(res, 403, 'Old password mismatch');
    }

    userDoc.password = await argon2.hash(newPassword);

    await userDoc.save();

    ResponseService.json(res, 200, 'User password changed successfully.');
  } catch (error) {
    ResponseService.json(res, error);
  }
};

/**
 * @TODO: forget implementation
 */
// const forget = (req: Request, res: Response) => {}

const reset = async (req, res) => {
  try {
    const { error, value } = resetSchema.validate(req.body);

    if (error) {
      console.log(error);
      return ResponseService.json(res, error);
    }

    const { email, password, repeatPassword } = value;
    const user = await PaginateUserModel.findOne({
      email,
      isDeleted: { $ne: true },
    });

    if (!user) {
      return ResponseService.json(
        res,
        400,
        'User not found for password reset.'
      );
    }

    if (password !== repeatPassword) {
      return ResponseService.json(res, 400, 'Password mismatch.');
    }

    user.password = await argon2.hash(password);

    await user.save();

    ResponseService.json(res, 200, 'User password reset successfully.');
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const editUser = async (req, res) => {
  try {
    const email = req.params.email;
    const { error, value } = editSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const updatedUser = await PaginateUserModel.findOneAndUpdate(
      { email, isDeleted: { $ne: true } },
      value,
      {
        new: true,
      }
    ).select('-password');

    ResponseService.json(
      res,
      200,
      'User profile updated successfully.',
      updatedUser
    );
  } catch (error) {
    if (error.code == 11000)
      ResponseService.json(res, 400, `${error.keyValue.email} already exists.`);

    ResponseService.json(res, error);
  }
};

const deleteUser = async (req, res) => {
  const { user } = req;
  await PaginateUserModel.findOneAndUpdate(
    { _id: user.id, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } },
    { new: true }
  );

  ResponseService.json(res, 200, 'User profile deleted successfully.');
};

const setOrChangeRole = async (req, res) => {
  try {
    const email = req.params.email;
    const { error, value } = setRoleSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const user = await PaginateUserModel.findOneAndUpdate(
      { email, isDeleted: { $ne: true } },
      value,
      { new: true }
    ).select('-password');

    if (!user) {
      return ResponseService.json(res, 400, 'User not found.');
    }

    createAuditLog({
      creator: user.id,
      message: `<a href="${user.email}">${user.email}</a> assigned ${value.role} role.`,
      metadata: user,
    });

    ResponseService.json(res, 200, 'User role updated successfully.', user);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

export {
  currentUser,
  getUsers,
  signup,
  login,
  changePassword,
  reset,
  editUser,
  deleteUser,
  setOrChangeRole,
};
