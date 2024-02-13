/**
 * @openapi
 * paths:
 *  /users/me:
 *    get:
 *      tags: [User]
 *      summary: Get user
 *      description: Get current user
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: User retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
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
 * #=================================================================
 *
 *  /users/list:
 *    get:
 *      tags: [User]
 *      summary: List users
 *      description: Get paginated users
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/PerPage'
 *        - $ref: '#/components/parameters/PageLimit'
 *        - $ref: '#/components/parameters/Searches'
 *        - $ref: '#/components/parameters/Pagination'
 *      responses:
 *        200:
 *          description: Users retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                items:
 *                  type: object
 *                  required:
 *                    - firstname
 *                    - lastname
 *                    - middlename
 *                    - email
 *                properties:
 *                  message:
 *                     type: string
 *                  data:
 *                     type: object
 *                example:
 *                  message: User retrieved successfully
 *                  data: {}
 *        400:
 *          $ref: '#/components/responses/400Error'
 *        500:
 *          $ref: '#/components/responses/500Error'
 *
 *
 * #============================================================================
 *
 *  /users/sign-up:
 *    post:
 *     tags: [User]
 *     summary: Sign up
 *     description: Create user account
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - firstname
 *                 - lastname
 *                 - email
 *                 - password
 *               properties:
 *                 firstname:
 *                   type: string
 *                   example: Frank
 *                 lastname:
 *                   type: string
 *                   example: Kodie
 *                 middlename:
 *                   type: string
 *                   example: Adu
 *                 phoneNumber:
 *                   type: string
 *                   example: +2330506369241
 *                 email:
 *                   type: string
 *                   example: frankkodie@yahoo.com
 *                 password:
 *                   type: string
 *                   example: Frank25.!
 *                 repeatPassword:
 *                   type: string
 *                   example: Frank25.!
 *                 role:
 *                   type: string
 *                   enum: [user, admin, superadmin]
 *                   example: superadmin
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                      type: string
 *       400:
 *          $ref: '#/components/responses/400Error'
 *       500:
 *         $ref: '#/components/responses/500Error'
 *
 * #========================================================================
 *
 *  /users/login:
 *    post:
 *      tags: [User]
 *      summary: Login
 *      description: User login account
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *              properties:
 *                email:
 *                 type: string
 *                 example: frankkodie@yahoo.com
 *                password:
 *                  type: string
 *                  example: Frank25.!
 *      responses:
 *         200:
 *           description: User logged in successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   data:
 *                     type: string
 *                     properties:
 *                       token:
 *                        type: string
 *         400:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         401:
 *           description: Password invalid
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         500:
 *           $ref: '#/components/responses/500Error'
 *
 * #================================================================================
 *
 *  /users/change-password:
 *    put:
 *      tags: [User]
 *      summary: Change password
 *      description: Change user password
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                oldPassword:
 *                  type: string
 *                newPassword:
 *                  type: string
 *                repeatPassword:
 *                  type: string
 *              required:
 *                - oldPassword
 *                - newPassword
 *                - repeatPassword
 *              example:
 *                oldPassword: Frank25.!
 *                newPassword: Frank25!!&
 *                repeatPassword: Frank25!!%
 *      responses:
 *         200:
 *           description: User password changed successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                    type: string
 *         400:
 *           $ref: '#/components/responses/400Error'
 *         500:
 *           $ref: '#/components/responses/500Error'
 *
 * #=============================================================================================
 *
 *  /users/reset:
 *    put:
 *      tags: [User]
 *      summary: Reset password
 *      description: Reset user password
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                repeatPassword:
 *                  type: string
 *              example:
 *                email: frankkodie@yahoo.com
 *                password: 8702fg955182
 *                repeatPassword: 8702fg955182
 *      responses:
 *        200:
 *          description: User password reset successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        400:
 *          $ref: '#/components/responses/400Error'
 *        500:
 *          $ref: '#/components/responses/500Error'
 *
 * #===================================================================================================
 *
 *  /users/edit:
 *    put:
 *      tags: [User]
 *      summary: Edit user
 *      description: Edit user profile
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                firstname:
 *                   type: string
 *                lastname:
 *                   type: string
 *                middlename:
 *                   type: string
 *                email:
 *                   type: string
 *              example:
 *                firstname: Frank
 *                lastname: Opoku
 *                middlename: Adum
 *                email: lobsty21@yahoo.com
 *              optional:
 *                - firstname
 *                - lastname
 *      responses:
 *        200:
 *          description: User profile updated successfully
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
 * #=========================================================================
 *
 *  /users/{email}/change-role:
 *    put:
 *      tags: [User]
 *      summary: Change role
 *      description: Change user role
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: email
 *          in: path
 *          description: Specify user email address
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  role:
 *                    type: string
 *                required:
 *                  - role
 *                example:
 *                  role: admin
 *      responses:
 *        200:
 *          description: User role updated successfully
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
 *          description: User not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        401:
 *          description: User is not authorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        500:
 *          $ref: '#components/responses/500Error'
 *
 * #=========================================================================
 *
 *  /users/delete:
 *    delete:
 *         tags: [User]
 *         summary: Delete user
 *         description: Delete user profile
 *         security:
 *           - bearerAuth: []
 *         responses:
 *           200:
 *             description: User profile deleted successfully
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *           400:
 *             $ref: '#/components/responses/400Error'
 *           500:
 *             $ref: '#/components/responses/500Error'
 *
 * #============================================================================
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
 *     User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          example: 65797f7d72e45a094b2db249
 *        firstname:
 *          type: string
 *          example: Frank
 *        lastname:
 *          type: string
 *          example: Kodie
 *        middlename:
 *          type: string
 *          example: Adu
 *        email:
 *          type: string
 *          example: frankkodie@yahoo.com
 *        password:
 *          type: string
 *          example: Frank25@.!
 *        role:
 *          type: string
 *          enum:
 *            - user
 *            - admin
 *            - superadmin
 *          example: superadmin
 *      required:
 *        - firstname
 *        - lastname
 *        - email
 *        - password
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
 *
 *   responses:
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
