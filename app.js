import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import nunjucks from 'nunjucks';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import viewsRouter from './routes/views.js';
import usersRouter from './routes/user.route.js';
import customersRouter from './routes/customer.route.js';
import suppliersRouter from './routes/supplier.route.js';
import productsRouter from './routes/product.route.js';
import ordersRouter from './routes/order.route.js';
import orderDetailsRouter from './routes/order-detail.route.js';
import locationsRouter from './routes/location.route.js';
import transactionsRouter from './routes/transaction.route.js';
import auditLogsRouter from './routes/audit.route.js';
import cartRouter from './routes/cart.route.js';
import stockRouter from './routes/stock.route.js';
import { SWAGGER_DOCS } from './constants/constant.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

nunjucks.configure(path.join('views'), {
  autoescape: true,
  express: app,
  watch: true,
});
app.set('view engine', 'html');
app.set('trust proxy', 1);

app.use(cors());
app.use(helmet());
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJSDoc(SWAGGER_DOCS), { explorer: true })
);

// app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// html views
app.use('/', viewsRouter);

// API endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/suppliers', suppliersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/order-details', orderDetailsRouter);
app.use('/api/v1/locations', locationsRouter);
app.use('/api/v1/transactions', transactionsRouter);
app.use('/api/v1/auditlogs', auditLogsRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/stocks', stockRouter);

export default app;