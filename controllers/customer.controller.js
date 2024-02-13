import { ResponseService } from '../utils/response.service.js';
import {
  createCustomerSchema,
  editCustomerSchema,
} from '../schemas/customer.schema.js';
import { PaginateCustomerModel } from '../models/customer.model.js';
import { createAuditLog } from './audit.controller.js';

const getCustomer = async (req, res) => {
  try {
    const query = {
      isDeleted: { $ne: true },
    };

    const customerIdOrEmail = req.params.customer;

    if (customerIdOrEmail.includes('@')) {
      query.email = customerIdOrEmail;
    } else {
      query._id = customerIdOrEmail;
    }

    const customer = await PaginateCustomerModel.findOne(query);

    if (!customer) {
      return ResponseService.json(res, 400, 'Customer not found.');
    }

    ResponseService.json(res, 200, 'Customer retrieved successfully', customer);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await PaginateCustomerModel.find({
      isDeleted: { $ne: true },
    });
    const _customers = customers.map((customer) => {
      return {
        id: customer.id,
        firstname: customer.firstname,
        middlename: customer.middlename,
        lastname: customer.lastname,
        phonenumber: customer.phoneNumber,
        email: customer.email,
        address: customer.address1,
      };
    });

    res.json({ data: _customers });
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const createCustomer = async (req, res) => {
  try {
    const { error, value } = createCustomerSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const customer = await PaginateCustomerModel.create(value);

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> add a customer: <b>${customer.firstname} ${customer.lastname}</b>`,
        metadata: customer,
      });

    ResponseService.json(res, 201, 'Customer created successfully.', customer);
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

const editCustomer = async (req, res) => {
  try {
    const query = {
      isDeleted: { $ne: true },
    };
    const { error, value } = editCustomerSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const customerIdOrEmail = req.params.customer;

    if (customerIdOrEmail.includes('@')) {
      query.email = customerIdOrEmail;
    } else {
      query._id = customerIdOrEmail;
    }

    const updatedcustomer = await PaginateCustomerModel.findOneAndUpdate(
      query,
      value,
      { new: true }
    );

    if (!updatedcustomer) {
      return ResponseService.json(
        res,
        400,
        'Customer not found to be updated.'
      );
    }

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> updated customer <b>${updatedcustomer.firstname} ${updatedcustomer.lastname}</b> detail.`,
        metadata: updatedcustomer,
      });

    ResponseService.json(
      res,
      200,
      'Customer updated successfully.',
      updatedcustomer
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = req.params.customer;

    const deletedCustomer = await PaginateCustomerModel.findOneAndUpdate(
      { _id: customer, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!deletedCustomer) {
      return ResponseService.json(
        res,
        400,
        'Customer not found to be deleted.'
      );
    }

    ResponseService.json(res, 200, 'Customer deleted successfully.');
  } catch (error) {
    ResponseService.json(res, error);
  }
};

export {
  getCustomer,
  getCustomers,
  createCustomer,
  editCustomer,
  deleteCustomer,
};
