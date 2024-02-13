/**
 * @openapi
 * paths:
 *  /order-s/{detail}:
 *    get:
 *      tags: [OrderDetail]
 *      summary: Get order detail
 *      description: Get current order detail
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/OrderDetailParam'
 *      responses:
 *        200:
 *          description: Order detail retrieved successfully
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
 *          $ref: '#/components/responses/OrderDetailNotFound'
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
 *  /order-details/list:
 *    get:
 *      tags: [OrderDetail]
 *      summary: List order details
 *      description: Get paginated order details
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/PerPage'
 *        - $ref: '#/components/parameters/PageLimit'
 *        - $ref: '#/components/parameters/Searches'
 *        - $ref: '#/components/parameters/Pagination'
 *      responses:
 *        200:
 *          description: Order details retrieved successfully
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
 *  /order-details/{order}/create/{product}:
 *    post:
 *     tags: [OrderDetail]
 *     summary: Create order detail
 *     description: Create order detail information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/ProductParam'
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDetail'
 *     responses:
 *       201:
 *         description: Order detail created successfully
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
 *  /order-details/{detail}/edit:
 *    put:
 *      tags: [OrderDetail]
 *      summary: Edit order detail
 *      description: Edit order detail information
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/OrderDetailParam'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderDetail'
 *      responses:
 *        200:
 *          description: Order detail updated successfully
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
 *          $ref: '#/components/responses/OrderDetailNotFound'
 *        500:
 *          $ref: '#/components/responses/500Error'
 *
 * #================================================================================
 *
 *  /order-details/{detail}/delete:
 *    delete:
 *         tags: [OrderDetail]
 *         summary: Delete order detail
 *         description: Delete order detail information
 *         security:
 *           - bearerAuth: []
 *         parameters:
 *           - $ref: '#/components/parameters/OrderDetailParam'
 *         responses:
 *           200:
 *             description: Order detail deleted successfully
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *           400:
 *             $ref: '#/components/responses/OrderDetailNotFound'
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
 *     OrderDetail:
 *      type: object
 *      properties:
 *        description:
 *          type: string
 *        unitPrice:
 *          type: number
 *        quantity:
 *          type: number
 *      required:
 *        - unitPrice
 *      example:
 *        description: Purchase from Geo Inc.
 *        unitPrice: 150
 *        quantity: 5
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
 *     OrderDetailParam:
 *       name: detail
 *       in: path
 *       description: Specify the order detail id
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
 *     ProductParam:
 *       name: product
 *       in: path
 *       description: Specify the product id
 *       schema:
 *         type: string
 *
 *
 *
 *   responses:
 *     OrderDetailNotFound:
 *        description: Order detail not found
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
