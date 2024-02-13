import { createCartSchema } from '../schemas/cart.schema.js';
import { ResponseService } from '../utils/response.service.js';
import { PaginateCartModel } from '../models/cart.model.js';
import { createAuditLog } from './audit.controller.js';

const getCustomerCarts = async (req, res) => {
  try {
    const carts = await PaginateCartModel.find({
      customer: req.params.customer,
      isDeleted: { $ne: true },
    }).populate(['customer', 'product']);

    const _carts = carts.map((cart) => {
      return {
        customer: `${cart.customer.firstname} ${cart.customer.lastname}`,
        product: cart.product.name,
        unitPrice: cart.unitPrice,
        quantity: cart.quantity,
        amount: cart.unitPrice * cart.quantity,
      };
    });

    res.json({ data: await Promise.all(_carts) });
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const getCustomerGrandTotal = async (req, res) => {
  const carts = await PaginateCartModel.find({
    customer: req.params.customer,
    isDeleted: { $ne: true },
  });

  const grandTotal = carts.reduce(
    (acc, c) => acc + c.unitPrice * c.quantity,
    0
  );

  ResponseService.json(res, 200, 'Customer cart amount to pay.', grandTotal);
};

const createCustomerCart = async (req, res) => {
  console.log('Request body: ', req.body)
  try {
    const customer = req.params.customer;
    const { error, value } = createCartSchema.validate(req.body);

    value.customer;

    if (error) return ResponseService.json(res, error);

    const cart = await PaginateCartModel.create({ ...value, customer });

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}">${req.user.email}</a> added product: <b>${value.product}</b> to customer: <b>${customer}<b> cart.`,
        metadata: cart,
      });

    ResponseService.json(res, 200, 'Customer cart created successfully.', cart);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

export { getCustomerCarts, getCustomerGrandTotal, createCustomerCart };
