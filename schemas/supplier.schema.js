import Joi from 'joi';

const createSupplierSchema = Joi.object({
  firstname: Joi.string().min(3).max(30).trim().required(),
  lastname: Joi.string().min(3).max(30).trim().required(),
  middlename: Joi.string().min(3).max(30).trim(),
  phoneNumber: Joi.string().min(10).max(12).trim().required(),
  email: Joi.string().email().trim(),
  address1: Joi.string().required().trim(),
  address2: Joi.string().trim(),
});

const editSupplierSchema = Joi.object({
  firstname: Joi.string().min(3).max(30).trim(),
  lastname: Joi.string().min(3).max(30).trim(),
  middlename: Joi.string().min(3).max(30).trim(),
  phoneNumber: Joi.string().min(10).max(12).trim(),
  email: Joi.string().email().trim(),
  address1: Joi.string().trim(),
  address2: Joi.string().trim(),
});

export { createSupplierSchema, editSupplierSchema };
