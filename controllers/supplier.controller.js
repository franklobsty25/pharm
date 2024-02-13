import { PaginateSupplierModel } from '../models/supplier.model.js';
import { ResponseService } from '../utils/response.service.js';
import {
  createSupplierSchema,
  editSupplierSchema,
} from '../schemas/supplier.schema.js';
import { createAuditLog } from './audit.controller.js';

const getSupplier = async (req, res) => {
  try {
    const query = {
      isDeleted: { $ne: true },
    };
    const supplierIdOrEmail = req.params.supplier;

    if (supplierIdOrEmail.includes('@')) {
      query.email = supplierIdOrEmail;
    } else {
      query._id = supplierIdOrEmail;
    }

    const supplier = await PaginateSupplierModel.findOne(query);

    if (!supplier) {
      return ResponseService.json(res, 400, 'Supplier not found.');
    }

    ResponseService.json(
      res,
      200,
      'Supplier retrieved successfully.',
      supplier
    );
  } catch (error) {
    console.log(error);
    ResponseService.json(res, error);
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await PaginateSupplierModel.find({
      isDeleted: { $ne: true },
    });

    const _suppliers = suppliers.map((supplier) => {
      return {
        id: supplier.id,
        firstname: supplier.firstname,
        middlename: supplier.middlename,
        lastname: supplier.lastname,
        phonenumber: supplier.phoneNumber,
        email: supplier.email,
        address: supplier.address1,
      };
    });

    res.json({ data: _suppliers });
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const createSupplier = async (req, res) => {
  try {
    const { error, value } = createSupplierSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const supplier = await PaginateSupplierModel.create(value);

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> created supplier information.`,
        metadata: supplier,
      });

    ResponseService.json(res, 201, 'Supplier created successfully.', supplier);
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

const editSupplier = async (req, res) => {
  try {
    const query = { isDeleted: { $ne: true } };
    const supplierIdOrEmail = req.params.supplier;
    const { error, value } = editSupplierSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    if (supplierIdOrEmail.includes('@')) {
      query.email = supplierIdOrEmail;
    } else {
      query._id = supplierIdOrEmail;
    }

    const updatedSupplier = await PaginateSupplierModel.findOneAndUpdate(
      query,
      value,
      { new: true }
    );

    if (!updatedSupplier) {
      return ResponseService.json(
        res,
        400,
        'Supplier not found to be updated.'
      );
    }

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> updated supplier: <b>${updatedSupplier.firstname} ${updatedSupplier.lastname}</b> information.`,
        metadata: updatedSupplier,
      });

    ResponseService.json(
      res,
      200,
      'Supplier updated successfully.',
      updatedSupplier
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const deleteSupplier = async (req, res) => {
  const supplierId = req.params.supplier;

  const deletedSupplier = await PaginateSupplierModel.findOneAndUpdate(
    { _id: supplierId, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!deletedSupplier) {
    return ResponseService.json(res, 400, 'Supplier not found to be deleted.');
  }

  ResponseService.json(res, 200, 'Supplier deleted successfully.');
};

export {
  getSupplier,
  getSuppliers,
  createSupplier,
  editSupplier,
  deleteSupplier,
};
