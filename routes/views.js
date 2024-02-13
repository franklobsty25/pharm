import { Router } from 'express';
import {
  RolesEnum,
  CategoryEnum,
  LocationTypeEnum,
  OrderStatusEnum,
  TransactionModeEnum,
} from '../constants/constant.js';
import { getProductsForPurchase } from '../controllers/product.controller.js';
import dayjs from 'dayjs';

const router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('index.html', { year });
});

/* GET Dashboard page. */
router.get('/dashboard', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('dashboard.html', { year });
});

/* GET users page. */
router.get('/users', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('users.html', { year });
});

/* GET create-user page. */
router.get('/user', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('create-user.html', { roles: Object.values(RolesEnum), year });
});

/* GET change password page. */
router.get('/change-password', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('change-password.html', { roles: Object.values(RolesEnum), year });
});

/* GET edit user page. */
router.get('/edit', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('edit-user.html', { roles: Object.values(RolesEnum), year });
});

/* GET reset password page. */
router.get('/reset', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('reset.html', { year });
});

/* GET suppliers page. */
router.get('/suppliers', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('suppliers.html', { year });
});

/* GET create supplier page. */
router.get('/supplier', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('create-supplier.html', { year });
});

/* GET edit supplier page. */
router.get('/edit-supplier', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('edit-supplier.html', { year });
});

/* GET products page. */
router.get('/products', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('products.html', {
    categories: Object.values(CategoryEnum),
    year,
  });
});

/* GET create product page. */
router.get('/product', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('create-product.html', {
    categories: Object.values(CategoryEnum),
    year,
  });
});

/* GET edit product page. */
router.get('/edit-product', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('edit-product.html', {
    categories: Object.values(CategoryEnum),
    year,
  });
});

/* GET restock product page. */
router.get('/stock', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('stock-product.html', {
    categories: Object.values(CategoryEnum),
    year,
  });
});

/* GET locations page. */
router.get('/locations', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('locations.html', {
    types: Object.values(LocationTypeEnum),
    year,
  });
});

/* GET create location page. */
router.get('/location', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('create-location.html', {
    types: Object.values(LocationTypeEnum),
    year,
  });
});

/* GET edit location page. */
router.get('/edit-location', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('edit-location.html', {
    types: Object.values(LocationTypeEnum),
    year,
  });
});

/* GET customers page. */
router.get('/customers', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('customers.html', { year });
});

/* GET create customer page. */
router.get('/customer', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('create-customer.html', { year });
});

/* GET edit customer page. */
router.get('/edit-customer', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('edit-customer.html', { year });
});

/* GET cart page. */
router.get('/cart', async function (req, res, next) {
  const year = dayjs().format('YYYY');
  const products = await getProductsForPurchase();
  res.render('cart.html', { products, year });
});

/* GET checkout page. */
router.get('/checkout', async function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('checkout.html', {
    statuses: Object.values(TransactionModeEnum),
    year,
  });
});

/* GET transactions page. */
router.get('/transactions', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('transactions.html', {
    modes: Object.values(TransactionModeEnum),
    year,
  });
});

/* GET order details page. */
router.get('/orders', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('order-detail.html', {
    year,
  });
});

/* GET product detail page. */
router.get('/detail', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('product-detail.html', {
    year,
  });
});

/* GET audits page. */
router.get('/audits', function (req, res, next) {
  const year = dayjs().format('YYYY');
  res.render('audits.html', { year });
});

export default router;
