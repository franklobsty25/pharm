import { PaginateOrderDetailModel } from '../models/order-detail.model.js';
import { ResponseService } from '../utils/response.service.js';
import {
  createOrderDetailSchema,
  editOrderDetailSchema,
} from '../schemas/order-detail.schema.js';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';

dayjs.extend(isSameOrBefore);

const getOrderDetail = async (req, res) => {
  try {
    const detail = req.params.detail;

    const orderDetail = await PaginateOrderDetailModel.findOne({
      _id: detail,
      isDeleted: { $ne: true },
    }).populate([
      {
        path: 'order',
        populate: {
          path: 'customer',
        },
      },
      { path: 'product' },
    ]);

    if (!orderDetail) {
      return ResponseService.json(res, 400, 'Order detail not found.');
    }

    const _orderDetail = {
      customerName: `${orderDetail.order.customer.firstname} ${orderDetail.order.customer.lastname}`,
      customerEmail: orderDetail.order.customer.email,
      customerPhoneNumber: orderDetail.order.customer.phoneNumber,
      customerAddress: orderDetail.order.customer.address1,
      customerAddress2: orderDetail.order.customer.address2,
      productName: orderDetail.product.name,
      productUnitPrice: orderDetail.unitPrice,
      productQuantity: orderDetail.quantity,
      productDescription: orderDetail.description,
    };

    ResponseService.json(
      res,
      200,
      'Order detail retrieved successfully.',
      _orderDetail
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order = req.params.order;
    const orderDetails = await PaginateOrderDetailModel.find({
      order,
      isDeleted: { $ne: true },
    }).populate([
      {
        path: 'order',
        populate: {
          path: 'customer',
        },
      },
      { path: 'product' },
    ]);

    const _orderDetails = orderDetails.map((orderDetail) => {
      return {
        customer: `${orderDetail.order.customer.firstname} ${orderDetail.order.customer.lastname}`,
        product: orderDetail.product.name,
        unitPrice: orderDetail.unitPrice,
        quantity: orderDetail.quantity,
        description: orderDetail.description,
        orderDetail: orderDetail.id,
      };
    });

    res.json({ data: _orderDetails });
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const getProductHistory = async (req, res) => {
  const ordertDetails = await PaginateOrderDetailModel.find({
    isDeleted: { $ne: true },
  }).populate({ path: 'product', populate: { path: 'supplier' } });
  
  const _ordertDetails = ordertDetails.map((order) => {
    const isExpired = dayjs(order.product.expire).isSameOrBefore(dayjs());
    const supplier = `${order.product.supplier.firstname} ${order.product.supplier.lastname}`;

    return {
      product: `${order.product.name}-${supplier}`,
      unitPrice: order.product.unitPrice,
      quantity: order.product.quantity,
      sold: order.quantity,
      difference: order.product.quantity - order.quantity,
      expire: isExpired
        ? 'Expired'
        : dayjs(order.product.expire).format('MMMM D, YYYY'),
    };
  });

  res.json({ data: _ordertDetails });
};

const createOrderDetail = async (payload) => {
  try {
    const { error, value } = createOrderDetailSchema.validate(payload);

    if (error) {
      throw error;
    }

    return PaginateOrderDetailModel.create(value);
  } catch (error) {
    throw error;
  }
};

const editOrderDetail = async (req, res) => {
  try {
    const detailId = req.params.detail;

    const { error, value } = editOrderDetailSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const updatedOrderDetail = await PaginateOrderDetailModel.findOneAndUpdate(
      { _id: detailId, isDeleted: { $ne: true } },
      value,
      { new: true }
    );

    if (!updatedOrderDetail) {
      return ResponseService.json(
        res,
        400,
        'Order detail not found to be updated.'
      );
    }

    ResponseService.json(
      res,
      200,
      'Order detail updated successfully.',
      updatedOrderDetail
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const deleteOrderDetail = async (req, res) => {
  const detailId = req.params.detail;

  const deletedOrderDetail = await PaginateOrderDetailModel.findOneAndUpdate(
    { _id: detailId, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!deletedOrderDetail) {
    return ResponseService.json(
      res,
      400,
      'Order detail not found to be deleted.'
    );
  }

  ResponseService.json(res, 200, 'Order detail deleted successfully.');
};

export {
  getOrderDetail,
  getOrderDetails,
  getProductHistory,
  createOrderDetail,
  editOrderDetail,
  deleteOrderDetail,
};
