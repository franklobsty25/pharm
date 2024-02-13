import { PaginateTransactionModel } from '../models/transaction.model.js';
import { ResponseService } from '../utils/response.service.js';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import {
  createTransactionSchema,
  editTransactionSchema,
} from '../schemas/transaction.schema.js';
import { PaginateOrderModel } from '../models/order.model.js';
import { OrderStatusEnum } from '../constants/constant.js';
import { createAuditLog } from './audit.controller.js';
import { PaginateSupplierModel } from '../models/supplier.model.js';
import { PaginateProductModel } from '../models/product.model.js';
import { PaginateLocationModel } from '../models/location.model.js';
import { PaginateOrderDetailModel } from '../models/order-detail.model.js';

const getTransaction = async (req, res) => {
  try {
    const transactionId = req.params.transaction;

    const transaction = await PaginateTransactionModel.findOne({
      _id: transactionId,
      isDeleted: { $ne: true },
    });

    if (!transaction) {
      return ResponseService.json(
        res,
        400,
        'Transaction information not found.'
      );
    }

    ResponseService.json(
      res,
      200,
      'Transaction information retrieved successfully.',
      transaction
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await PaginateTransactionModel.find({
      isDeleted: { $ne: true },
    }).populate({
      path: 'order',
      populate: { path: 'customer', select: 'firstname lastname' },
    });

    const _transactions = transactions.map((transaction) => {
      return {
        customer: `${transaction.order.customer.firstname} ${transaction.order.customer.lastname}`,
        amount: transaction.order.amount,
        status: transaction.order.status,
        completion: dayjs(transaction.order.completedDate).format(
          'dddd, MMMM D, YYYY hh:mm A'
        ),
        order: transaction.order.id,
      };
    });

    res.json({ data: _transactions });
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const getDashboardOverview = async (req, res) => {
  try {
    const query = {
      isDeleted: { $ne: true },
    };
    const today = dayjs();
    const yesterday = dayjs().subtract(1, 'day').toDate();
    const thisMonth = dayjs().startOf('month');
    const lastMonth = thisMonth.clone().subtract(1, 'month');
    const last3Month = lastMonth.clone().subtract(1, 'month');
    const last6Month = lastMonth.clone().subtract(2, 'month');

    const todayQuery = {
      ...query,
      createdAt: {
        $gte: today.startOf('day').toDate(),
        $lte: today.endOf('day').toDate(),
      },
      status: OrderStatusEnum.COMPLETED,
    };

    const yesterdayQuery = {
      ...query,
      createdAt: { $gte: yesterday, $lte: yesterday },
      status: OrderStatusEnum.COMPLETED,
    };

    const thisMonthQuery = {
      ...query,
      createdAt: {
        $gte: thisMonth.startOf('month').toDate(),
        $lte: thisMonth.endOf('month').toDate(),
      },
      status: OrderStatusEnum.COMPLETED,
    };

    const lastMonthQuery = {
      ...query,
      createdAt: {
        $gte: lastMonth.startOf('month').toDate(),
        $lte: lastMonth.endOf('month').toDate(),
      },
      status: OrderStatusEnum.COMPLETED,
    };

    const thisQuarterQuery = {
      ...query,
      createdAt: {
        $gte: last3Month.startOf('month').toDate(),
        $lte: last3Month.endOf('month').toDate(),
      },
      status: OrderStatusEnum.COMPLETED,
    };

    const thisBiYear = {
      ...query,
      createdAt: {
        $gte: last6Month.startOf('month').toDate(),
        $lte: last6Month.endOf('month').toDate(),
      },
      status: OrderStatusEnum.COMPLETED,
    };

    const [
      suppliers,
      products,
      locations,
      orders,
      todayRevenues,
      yesterdayRevenues,
      thisMonthRevenues,
      lastMonthRevenues,
      thisQuarterRevenues,
      thisBiYearRevenues,
    ] = await Promise.all([
      PaginateSupplierModel.find(query).countDocuments(),
      PaginateProductModel.find(query).countDocuments(),
      PaginateLocationModel.find(query).countDocuments(),
      PaginateOrderModel.find(query).countDocuments(),
      getRevenueByPeriod(todayQuery),
      getRevenueByPeriod(yesterdayQuery),
      getRevenueByPeriod(thisMonthQuery),
      getRevenueByPeriod(lastMonthQuery),
      getRevenueByPeriod(thisQuarterQuery),
      getRevenueByPeriod(thisBiYear),
    ]);

    const overview = {
      counts: {
        suppliers,
        products,
        locations,
        orders,
      },
      revenues: {
        todayRevenues,
        thisMonthRevenues,
        thisQuarterRevenues,
        thisBiYearRevenues,
      },
      trends: {
        today: {
          difference: todayRevenues - yesterdayRevenues,
          trend: todayRevenues > yesterdayRevenues ? 'upward' : 'downward',
        },
        month: {
          difference: thisMonthRevenues - lastMonthRevenues,
          trend: thisMonthRevenues > lastMonthRevenues ? 'upward' : 'downward',
        },
        quarter: {
          difference: thisQuarterRevenues - thisBiYearRevenues,
          trend:
            thisQuarterRevenues > thisBiYearRevenues ? 'upward' : 'downward',
        },
      },
    };

    ResponseService.json(
      res,
      200,
      'Statiscis data retrieved successfully.',
      overview
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const createTransaction = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    const order = req.params.order;

    const { error, value } = createTransactionSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const [_, orderDetails, transactions] = await Promise.all([
      PaginateOrderModel.findOneAndUpdate(
        { _id: order, isDeleted: { $ne: true } },
        { status: OrderStatusEnum.COMPLETED },
        { session }
      ),
      PaginateOrderDetailModel.find(
        { order, isDeleted: { $ne: true } },
      ),
      PaginateTransactionModel.create([{ ...value, order }], { session }),
    ]);

    await Promise.all(
      orderDetails.map(async (order) => {
        await PaginateProductModel.findOneAndUpdate(
          { _id: order.product, isDeleted: { $ne: true } },
          { $set: { sold: order.quantity } },
        );
      })
    );

    session.endSession();

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href=edit?email="${req.user.email}">${req.user.email}</a> created transaction: ${transactions[0].id}`,
        metadata: transactions[0],
      });

    ResponseService.json(
      res,
      201,
      'Payment confirmed successfully.',
      transactions[0]
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const editTransaction = async (req, res) => {
  try {
    const transaction = req.params.transaction;

    const { error, value } = editTransactionSchema.validate(req.body);

    if (error) {
      return ResponseService.json(res, error);
    }

    const updatedTransaction = await PaginateTransactionModel.findOneAndUpdate(
      { _id: transaction, isDeleted: { $ne: true } },
      value,
      { new: true }
    );

    if (!updatedTransaction) {
      return ResponseService.json(
        res,
        400,
        'Transaction information not found.'
      );
    }

    ResponseService.json(
      res,
      200,
      'Transaction updated successfully.',
      updatedTransaction
    );
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = req.params.transaction;

    const deletedTransaction = await PaginateTransactionModel.findOneAndUpdate(
      { _id: transaction, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!deletedTransaction) {
      return ResponseService.json(
        res,
        400,
        'Transaction to be deleted not found.'
      );
    }

    ResponseService.json(res, 200, 'Transaction deleted successfully.');
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const getRevenueByPeriod = async (query) => {
  const orders = await PaginateOrderModel.find(query);
  return orders.reduce((acc, order) => acc + order.amount, 0);
};

export {
  getTransaction,
  getTransactions,
  getDashboardOverview,
  createTransaction,
  editTransaction,
  deleteTransaction,
};
