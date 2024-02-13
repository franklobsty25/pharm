/**
 * @openapi
 * paths:
 *  /transactions/{transaction}:
 *    get:
 *      tags: [Transaction]
 *      summary: Get transaction
 *      description: Get current transaction
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/TransactionParam'
 *      responses:
 *        200:
 *          description: Transaction retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                type:
 *                properties:
 *                  message:
 *                    type: string
 *                  data:
 *                    type: object
 *        400:
 *          $ref: '#/components/responses/TransactionNotFound'
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
 *  /transactions/list:
 *    get:
 *      tags: [Transaction]
 *      summary: List transactions
 *      description: Get paginated transactions
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
 *          description: Transactions retrieved successfully
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
 *  /transactions/{order}/create:
 *    post:
 *     tags: [Transaction]
 *     summary: Create transaction
 *     description: Create transaction information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/OrderParam'
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created successfully
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
 *  /transactions/{transaction}/edit:
 *    put:
 *      tags: [Transaction]
 *      summary: Edit transaction
 *      description: Edit transaction information
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/TransactionParam'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Transaction'
 *      responses:
 *        200:
 *          description: Transaction updated successfully
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
 *          $ref: '#/components/responses/TransactionNotFound'
 *        500:
 *          $ref: '#/components/responses/500Error'
 *
 * #================================================================================
 *
 *  /transactions/{transaction}/delete:
 *    delete:
 *         tags: [Transaction]
 *         summary: Delete transaction
 *         description: Delete transaction information
 *         security:
 *           - bearerAuth: []
 *         parameters:
 *           - $ref: '#/components/parameters/TransactionParam'
 *         responses:
 *           200:
 *             description: Transaction deleted successfully
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *           400:
 *             $ref: '#/components/responses/TransactionNotFound'
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
 *     Transaction:
 *      type: object
 *      properties:
 *        mode:
 *          type: string
 *          enum: [card, cash, momo]
 *        order:
 *          type: string
 *      example:
 *        mode: cash
 *        order: 65c40f630f210b8d24a60b41
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
 *        name: date
 *        in: query
 *        description: Filtering items by date, day, month, year
 *        schema:
 *          type: string
 *
 *     TransactionParam:
 *       name: transaction
 *       in: path
 *       description: Specify the transaction id
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
 *
 *   responses:
 *     TransactionNotFound:
 *        description: Transaction not found
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
