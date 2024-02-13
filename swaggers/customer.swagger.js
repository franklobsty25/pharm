/**
 * @openapi
 * paths:
 *  /customers/{customer}:
 *    get:
 *      tags: [Customer]
 *      summary: Get customer
 *      description: Get current customer
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/CustomerParam'
 *      responses:
 *        200:
 *          description: Customer retrieved successfully
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
 *          $ref: '#/components/responses/CustomerNotFound'
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
 *  /customers/list:
 *    get:
 *      tags: [Customer]
 *      summary: List customers
 *      description: Get paginated customers
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/PerPage'
 *        - $ref: '#/components/parameters/PageLimit'
 *        - $ref: '#/components/parameters/Searches'
 *        - $ref: '#/components/parameters/Pagination'
 *      responses:
 *        200:
 *          description: Customers retrieved successfully
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
 *  /customers/create:
 *    post:
 *     tags: [Customer]
 *     summary: Create customer
 *     description: Create customer information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Customer created successfully
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
 *  /customers/{customer}/edit:
 *    put:
 *      tags: [Customer]
 *      summary: Edit customer
 *      description: Edit customer information
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/CustomerParam'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Customer'
 *      responses:
 *        200:
 *          description: Customer updated successfully
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
 *          $ref: '#/components/responses/CustomerNotFound'
 *        500:
 *          $ref: '#/components/responses/500Error'
 *
 * #================================================================================
 *
 *  /customers/{customer}/delete:
 *    delete:
 *         tags: [Customer]
 *         summary: Delete customer
 *         description: Delete customer information
 *         security:
 *           - bearerAuth: []
 *         parameters:
 *           - $ref: '#/components/parameters/CustomerParam'
 *         responses:
 *           200:
 *             description: Customer deleted successfully
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *           400:
 *             $ref: '#/components/responses/CustomerNotFound'
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
 *     Customer:
 *      type: object
 *      properties:
 *        firstname:
 *          type: string
 *        lastname:
 *          type: string
 *        middlename:
 *          type: string
 *        email:
 *          type: string
 *        phoneNumber:
 *          type: string
 *        address1:
 *          type: string
 *        address2:
 *          type: string
 *      required:
 *        - firstname
 *        - lastname
 *        - email
 *        - phoneNumber
 *        - address1
 *      example:
 *        firstname: Afia
 *        lastname: Owusu
 *        middlename: Kwaku
 *        phoneNumber: +233200000000
 *        email: adukodie@gmail.com
 *        address1: GA-078-8769
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
 *     CustomerParam:
 *       name: customer
 *       in: path
 *       description: Specify the customer id
 *       schema:
 *         type: string
 *
 *
 *   responses:
 *     CustomerNotFound:
 *        description: Customer not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
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
