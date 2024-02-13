import { ResponseService } from '../utils/response.service.js';
import {
  createProductSchema,
  editProductSchema,
} from '../schemas/product.schema.js';
import { PaginateProductModel } from '../models/product.model.js';
import { createAuditLog } from './audit.controller.js';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';

dayjs.extend(isSameOrBefore);

const getProductsForPurchase = async () => {
  return PaginateProductModel.aggregate([
    {
      $match: { isDeleted: { $ne: true }, expire: { $gte: dayjs().toDate() } },
    },
    {
      $project: {
        name: 1,
        quantityDifference: { $subtract: ['$quantity', '$sold'] },
      },
    },
    {
      $match: { quantityDifference: { $gt: 0 } },
    },
  ]);
};

const getProduct = async (req, res) => {
  try {
    const productId = req.params.product;

    const product = await PaginateProductModel.findOne({
      _id: productId,
      isDeleted: { $ne: true },
    });

    if (!product) {
      return ResponseService.json(res, 400, 'Product not found');
    }

    ResponseService.json(res, 200, 'Product retrieved successfully', product);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await PaginateProductModel.find({
      isDeleted: { $ne: true },
    });

    const _products = products.map((product) => {
      const isExpired = dayjs(product.expire).isSameOrBefore(dayjs());
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        unitPrice: product.unitPrice,
        quantity: product.quantity,
        expire: isExpired
          ? 'Expired'
          : dayjs(product.expire).format('MMMM D, YYYY'),
      };
    });

    res.json({ data: _products });
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const createProduct = async (req, res) => {
  try {
    const supplier = req.params.supplier;
    const { error, value } = createProductSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    value.supplier = supplier;

    const product = await PaginateProductModel.create(value);

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> added product <b>${product.name}</b>.`,
        metadata: product,
      });

    ResponseService.json(res, 201, 'Product created successfully', product);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const editProduct = async (req, res) => {
  try {
    const productId = req.params.product;

    const { error, value } = editProductSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const updatedProduct = await PaginateProductModel.findOneAndUpdate(
      { _id: productId, isDeleted: { $ne: true } },
      value,
      { new: true }
    );

    if (!updatedProduct) {
      return ResponseService.json(res, 400, 'Product not found to be updated.');
    }

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> updated product: <b>${updatedProduct.name}</b> information`,
        metadata: updatedProduct,
      });

    ResponseService.json(
      res,
      200,
      'Product updated successfully',
      updatedProduct
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.product;

  const deletedProduct = await PaginateProductModel.findOneAndUpdate(
    { _id: productId, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!deletedProduct) {
    return ResponseService.json(res, 400, 'Product not found to be deleted.');
  }

  ResponseService.json(res, 200, 'Product deleted successfully');
};

export {
  getProductsForPurchase,
  getProduct,
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
};
