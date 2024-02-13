/**
 * @openapi
 * paths:
 *  /suppliers/{supplier}:
 *    get:
 *      tags: [Supplier]
 *      summary: Get supplier
 *      description: Get current supplier
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/SupplierParam'
 *      responses:
 *        200:
 *          description: Supplier retrieved successfully
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
 *          $ref: '#/components/responses/SupplierNotFound'
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
 *  /suppliers/list:
 *    get:
 *      tags: [Supplier]
 *      summary: List suppliers
 *      description: Get paginated suppliers
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/PerPage'
 *        - $ref: '#/components/parameters/PageLimit'
 *        - $ref: '#/components/parameters/Searches'
 *        - $ref: '#/components/parameters/Pagination'
 *      responses:
 *        200:
 *          description: Suppliers retrieved successfully
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
 *  /suppliers/create:
 *    post:
 *     tags: [Supplier]
 *     summary: Create supplier
 *     description: Create supplier information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
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
 *  /suppliers/{supplier}/edit:
 *    put:
 *      tags: [Supplier]
 *      summary: Edit supplier
 *      description: Edit supplier information
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/SupplierParam'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Supplier'
 *      responses:
 *        200:
 *          description: Supplier updated successfully
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
 *          $ref: '#/components/responses/SupplierNotFound'
 *        500:
 *          $ref: '#/components/responses/500Error'
 *
 * #================================================================================
 *
 *  /suppliers/{supplier}/delete:
 *    delete:
 *         tags: [Supplier]
 *         summary: Delete supplier
 *         description: Delete supplier information
 *         security:
 *           - bearerAuth: []
 *         parameters:
 *           - $ref: '#/components/parameters/SupplierParam'
 *         responses:
 *           200:
 *             description: Supplier deleted successfully
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *           400:
 *             $ref: '#/components/responses/SupplierNotFound'
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
 *     Supplier:
 *      type: object
 *      properties:
 *        firstname:
 *          type: string
 *        lastname:
 *          type: string
 *        middlename:
 *          type: string
 *        phoneNumber:
 *          type: string
 *        email:
 *          type: string
 *        address1:
 *          type: string
 *        address2:
 *          type: string
 *      required:
 *        - firstname
 *        - lastname
 *        - phoneNumber
 *        - address1
 *      example:
 *        firstname: Lawrence
 *        lastname: Mojo
 *        phoneNumber: +233509998871
 *        email: lawrencemojo@yahoo.com
 *        address1: Osu la, Accra
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
 *
 *   responses:
 *     SupplierNotFound:
 *        description: Supplier not found
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
