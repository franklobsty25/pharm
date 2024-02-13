import { PaginateOrderModel } from '../models/order.model.js';
import { ResponseService } from '../utils/response.service.js';
import { createOrderSchema, editOrderSchema } from '../schemas/order.schema.js';
import * as day from 'dayjs';
import { OrderStatusEnum } from '../constants/constant.js';
import mongoose from 'mongoose';
import { PaginateOrderDetailModel } from '../models/order-detail.model.js';
import { PaginateCartModel } from '../models/cart.model.js';
import { createAuditLog } from '../controllers/audit.controller.js';

const getOrder = async (req, res) => {
  try {
    const orderId = req.params.order;

    const order = await PaginateOrderModel.findOne({
      _id: orderId,
      isDeleted: { $ne: true },
    });

    if (!order) {
      return ResponseService.json(res, 400, 'Order not found.');
    }

    ResponseService.json(res, 200, 'Order retrieved successfully.', order);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, all, search, date } = req.query;

    const query = {
      isDeleted: { $ne: true },
    };

    if (search) query.$or = [{ status: { $regex: search, $options: 'i' } }];

    if (Number(search) >= 0) query.$or = [{ amount: Number(search) }];

    if (date) {
      query.$or = [
        { date: { $gte: day(search).toDate() } },
        { completedDate: { $gte: day(search).toDate() } },
      ];
    }

    const orders = await PaginateOrderModel.paginate(query, {
      sort: '-1',
      page: Number(page),
      limit: Number(limit),
      pagination: all === 'false',
    });

    ResponseService.json(res, 200, 'Orders retrieved successfully', orders);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const createOrder = async (req, res) => {
  try {
    const session = await mongoose.startSession();

    const customer = req.params.customer;

    const { error, value } = createOrderSchema.validate(req.body);

    if (error) return ResponseService.json(res, error);

    const customerCarts = await PaginateCartModel.find({
      customer,
      isDeleted: { $ne: true },
    });

    const order = await PaginateOrderModel.create([{ ...value, customer }], {
      session,
    });

    if (!order)
      return ResponseService.json(
        res,
        400,
        'An error occurred while creating the order. Please try again!'
      );

    const orderDetails = customerCarts.map((cart) => {
      return {
        order: order[0].id,
        product: cart.product,
        unitPrice: cart.unitPrice,
        quantity: cart.quantity,
        description: cart.description,
      };
    });
    
    await PaginateOrderDetailModel.create(orderDetails, { session });

    await PaginateCartModel.updateMany(
      { _id: { $in: customerCarts.map((cart) => cart.id) }, customer },
      { $set: { isDeleted: true } },
      { session }
    );

    session.endSession();

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> created order: <b>${order[0].id}</b>`,
        metadata: order[0],
      });

    ResponseService.json(res, 201, 'Order created successfully', order[0]);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const editOrder = async (req, res) => {
  try {
    const orderId = req.params.order;
    const { error, value } = editOrderSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    if (value.status) {
      const isValid = Object.values(OrderStatusEnum).includes(value.status);

      if (!isValid) {
        return ResponseService.json(res, 400, 'Invalid order status.');
      }
    }

    const updatedOrder = await PaginateOrderModel.findOneAndUpdate(
      { _id: orderId, isDeleted: { $ne: true } },
      { $set: { ...value, completedDate: new Date() } },
      { new: true }
    );

    if (!updatedOrder) {
      return ResponseService.json(res, 400, 'Order not found to be updated.');
    }

    ResponseService.json(res, 200, 'Order updated successfully.', updatedOrder);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.order;

  const deletedOrder = await PaginateOrderModel.findOneAndUpdate(
    { _id: orderId, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (!deletedOrder) {
    return ResponseService.json(res, 400, 'Order not found to be deleted.');
  }

  ResponseService.json(res, 200, 'Order deleted successfully.');
};

export { getOrder, getOrders, createOrder, editOrder, deleteOrder };
