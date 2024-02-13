/**
 * @openapi
 * paths:
 *  /products/{product}:
 *    get:
 *      tags: [Product]
 *      summary: Get product
 *      description: Get current product
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/ProductParam'
 *      responses:
 *        200:
 *          description: Product retrieved successfully
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
 *          $ref: '#/components/responses/ProductNotFound'
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
 *  /products/list:
 *    get:
 *      tags: [Product]
 *      summary: List products
 *      description: Get paginated products
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/PerPage'
 *        - $ref: '#/components/parameters/PageLimit'
 *        - $ref: '#/components/parameters/Searches'
 *        - $ref: '#/components/parameters/Pagination'
 *      responses:
 *        200:
 *          description: Products retrieved successfully
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
 *  /products/{supplier}/create:
 *    post:
 *     tags: [Product]
 *     summary: Create product
 *     description: Create product information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/SupplierParam'
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *  /products/{product}/edit:
 *    put:
 *      tags: [Product]
 *      summary: Edit product
 *      description: Edit product information
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/ProductParam'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      responses:
 *        200:
 *          description: Product updated successfully
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
 *          $ref: '#/components/responses/ProductNotFound'
 *        500:
 *          $ref: '#/components/responses/500Error'
 *
 * #================================================================================
 *
 *  /products/{product}/delete:
 *    delete:
 *         tags: [Product]
 *         summary: Delete product
 *         description: Delete product information
 *         security:
 *           - bearerAuth: []
 *         parameters:
 *           - $ref: '#/components/parameters/ProductParam'
 *         responses:
 *           200:
 *             description: Product deleted successfully
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *           400:
 *             $ref: '#/components/responses/ProductNotFound'
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
 *     Product:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        category:
 *          type: string
 *          enum: [capsule, cosmetic, grocery, syrup, tablet]
 *        unitPrice:
 *          type: number
 *        quantity:
 *          type: number
 *        reorder:
 *          type: boolean
 *      required:
 *        - name
 *        - category
 *        - unitPrice
 *      example:
 *        name: Paracetamol
 *        description: Headache treatment
 *        category: medicine
 *        unitPrice: 10
 *        quantity: 5000
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
 *     SupplierParam:
 *       name: supplier
 *       in: path
 *       description: Specify the supplier id
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
 *   responses:
 *     ProductNotFound:
 *        description: Product not found
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
