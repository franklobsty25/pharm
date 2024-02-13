import Joi from 'joi';

const createCustomerSchema = Joi.object({
  firstname: Joi.string().min(3).max(30).trim().required(),
  lastname: Joi.string().min(3).max(30).trim().required(),
  middlename: Joi.string().min(3).max(30).trim(),
  phoneNumber: Joi.string().min(10).max(12).trim().required(),
  email: Joi.string().email().trim().required(),
  address1: Joi.string().trim().required(),
  address2: Joi.string().trim(),
});

const editCustomerSchema = Joi.object({
  firstname: Joi.string().min(3).max(30).trim(),
  lastname: Joi.string().min(3).max(30).trim(),
  middlename: Joi.string().min(3).max(30).trim(),
  phoneNumber: Joi.string().min(10).max(12).trim(),
  email: Joi.string().email().trim(),
  address1: Joi.string().trim(),
  address2: Joi.string().trim(),
});

export { createCustomerSchema, editCustomerSchema };
