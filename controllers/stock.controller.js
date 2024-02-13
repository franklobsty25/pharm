import { PaginateProductModel } from '../models/product.model.js';
import { PaginateProductStockModel } from '../models/stock.model.js';
import { createProductStockSchema } from '../schemas/stock.schema.js';
import { ResponseService } from '../utils/response.service.js';
import { createAuditLog } from './audit.controller.js';
import lodash from 'lodash';
import cron from 'node-cron';

const createProductStock = async (req, res) => {
  try {
    const product = req.params.product;
    const { error, value } = createProductStockSchema.validate(req.body);

    if (error) return ResponseService.json(res, error);

    const stock = await PaginateProductStockModel.create({ ...value, product });

    if (req.user)
      createAuditLog({
        creator: req.user.id,
        message: `<a href="edit?email=${req.user.email}"></a> restock product with id: <b>${product}</b>`,
        metadata: stock,
      });

    ResponseService.json(res, 200, 'Product stocked successfully.', stock);
  } catch (error) {
    ResponseService.json(res, error);
  }
};

const stockProduct = async () => {
  const [products, stocks] = await Promise.all([
    PaginateProductModel.aggregate([
      {
        $match: {
          isDeleted: { $ne: true },
        },
      },
      {
        $project: {
          name: 1,
          unitPrice: 1,
          quantity: 1,
          expire: 1,
          category: 1,
          description: 1,
          quantityDifference: { $subtract: ['$quantity', '$sold'] },
        },
      },
      {
        $match: { quantityDifference: { $eq: 0 } },
      },
    ]),
    PaginateProductStockModel.find({ isDeleted: { $ne: true } }),
  ]);

  const groupByProduct = lodash.groupBy(products, '_id');
  const groupByStockProduct = lodash.groupBy(stocks, 'product');

  const _stocks = await Promise.all(
    Object.keys(groupByProduct).map(async (product) => {
      const stockProduct = groupByStockProduct[product][0];

      return await PaginateProductModel.findOneAndUpdate(
        { _id: product, isDeleted: { $ne: true } },
        {
          $set: {
            name: stockProduct.name,
            unitPrice: stockProduct.unitPrice,
            quantity: stockProduct.quantity,
            expire: stockProduct.expire,
            category: stockProduct.category,
            sold: 0,
            description: stockProduct.description,
          },
        },
        { new: true }
      );
    })
  );

  await PaginateProductStockModel.findOneAndUpdate(
    { product: _stocks.map((stock) => stock.id), isDeleted: { $ne: true } },
    { $set: { isDeleted: true } }
  );
};

cron.schedule('0 0 * * *', () => {
  stockProduct();
});

export { createProductStock, stockProduct };
