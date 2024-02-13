/**
 * @openapi
 * paths:
 *  /orders/{order}:
 *    get:
 *      tags: [Order]
 *      summary: Get order
 *      description: Get current order
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/OrderParam'
 *      responses:
 *        200:
 *          description: Order retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  data:
 *                    type: object
 *        400:
 *          $ref: '#/components/responses/OrderNotFound'
 *        401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        500:
 *          $ref: '#/components/responses/500Error'
 *
 * #=========================================================================
 *
 *  /orders/list:
 *    get:
 *      tags: [Order]
 *      summary: List orders
 *      description: Get paginated orders
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/PerPage'
 *        - $ref: '#/components/parameters/PageLimit'
 *        - $ref: '#/components/parameters/Searches'
 *        - $ref: '#/components/parameters/Pagination'
 *        - $ref: '#/components/parameters/DateQuery'
 *      responses:
 *        200:
 *          description: Orders retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  data:
 *                    type: object
 *        400:
 *          $ref: '#/components/responses/400Error'
 *        500:
 *          $ref: '#/components/responses/500Error'
 *
 * #========================================================================
 *
 *  /orders/{customer}/create:
 *    post:
 *     tags: [Order]
 *     summary: Create order
 *     description: Create order information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CustomerParam'
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: integer
 *                 date:
 *                   type: string
 *               example:
 *                 amount: 50000
 *                 date: 2023-12-20
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *          $ref: '#/components/responses/400Error'
 *       500:
 *         $ref: '#/components/responses/500Error'
 *
 * #=============================================================================
 *
 *  /orders/{order}/edit:
 *    put:
 *      tags: [Order]
 *      summary: Edit order
 *      description: Edit order information
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/OrderParam'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                amount:
 *                  type: integer
 *                status:
 *                  type: string
 *                date:
 *                  type: string
 *              example:
 *                amount: 10000
 *                status: completed
 *                date: 2023-12-19
 *      responses:
 *        200:
 *          description: Order updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  data:
 *                    type: object
 *        400:
 *          $ref: '#/components/responses/OrderNotFound'
 *        500:
 *          $ref: '#/components/responses/500Error'
 *
 * #================================================================================
 *
 *  /orders/{order}/delete:
 *    delete:
 *         tags: [Order]
 *         summary: Delete order
 *         description: Delete order information
 *         security:
 *           - bearerAuth: []
 *         parameters:
 *           - $ref: '#/components/parameters/OrderParam'
 *         responses:
 *           200:
 *             description: Order deleted successfully
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *           400:
 *             $ref: '#/components/responses/OrderNotFound'
 *           500:
 *             $ref: '#/components/responses/500Error'
 *
 * #================================================================================
 *
 *
 * components:
 *   securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *
 *   schemas:
 *     Order:
 *      type: object
 *      properties:
 *        amount:
 *          type: integer
 *        status:
 *          type: string
 *          enum: [pending, processing, completed]
 *        date:
 *          type: date
 *        completedDate:
 *          type: date
 *      required:
 *        - amount
 *      example:
 *        amount: 10000
 *        status: Pending
 *        date: 2023-12-10
 *        completedDate: 2023-01-01
 *
 *
 *   parameters:
 *     PerPage:
 *       name: page
 *       in: query
 *       description: Per page number
 *       schema:
 *         type: integer
 *
 *     PageLimit:
 *       name: limit
 *       in: query
 *       description: Limits the number of items on a page
 *       schema:
 *         type: integer
 *
 *     Searches:
 *       name: search
 *       in: query
 *       description: Searching for items on a page
 *       schema:
 *         type: string
 *
 *     Pagination:
 *       name: all
 *       in: query
 *       description: Paginating items on a page
 *       schema:
 *         type: boolean
 *
 *     DateQuery:
 *       name: date
 *       in: query
 *       description: Filtering items by date, day, month, year
 *       schema:
 *         type: string
 *
 *     OrderParam:
 *       name: order
 *       in: path
 *       description: Specify the order id
 *       schema:
 *         type: string
 *
 *     CustomerParam:
 *       name: customer
 *       in: path
 *       description: Specify the customer id
 *       schema:
 *         type: string
 *
 *
 *   responses:
 *     OrderNotFound:
 *        description: Order not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                 message:
 *                   type: string
 *     400Error:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     500Error:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 *
 *
 * security:
 *   - bearerAuth: []
 *
 *
 *
 *
 */
