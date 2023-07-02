import { Router } from 'express';
import * as userController from './user-controller';
import {
    validateCreateRequest,
    validateUpdateRequest,
    validateRequestWithId,
} from './user-validator';
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';
import { upload } from '../common/utils/multer';
export const usersRoutes: Router = Router();

// ** use apiAuthHandler to protect a route

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User operations
 */


/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users by pagination
 *     tags: [User]
 *     description: Retrieve a list of all users.
 *     parameters:
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users to return per page.
 *       - in: query
 *         name: current_page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The current page number.
 *     responses:
 *       200:
 *         description: A list of users[].
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
usersRoutes.get('/user', ApiHandler(userController.getAll));

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     description: Create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: file
 *                 description: Avatar image file.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
usersRoutes.post(
    '/user',
    protectRoute,
    // validateCreateRequest,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    ApiHandler(userController.create),
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     description: Retrieve a user by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: The retrieved user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
usersRoutes.get(
    '/user/:id',
    // protectRoute,
    validateRequestWithId,
    ApiHandler(userController.getById),
);

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update an user
 *     tags: [User]
 *     description: Update an existing user by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: file
 *                 description: Avatar image file.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
usersRoutes.patch(
    '/user/:id',
    protectRoute,
    // validateUpdateRequest,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    ApiHandler(userController.update),
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     description: Delete an existing user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: User successfully deleted.
 */
usersRoutes.delete(
    '/user/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(userController.destroy),
);

/**
 * @swagger
 * /bulk/user:
 *   post:
 *     summary: Bulk create users
 *     tags: [User]
 *     description: Create multiple users in bulk using a CSV file.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: CSV file containing influencers data.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
usersRoutes.post(
    '/bulk/user',
    protectRoute,
    ApiHandler(userController.bulkCreate),
);

/**
 * @swagger
 * /bulk/user:
 *   delete:
 *     summary: Bulk delete users
 *     tags: [User]
 *     description: Delete multiple users in bulk.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               ids: ["user1", "user2", "user3"]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Users successfully deleted.
 */
usersRoutes.delete(
    '/bulk/user',
    protectRoute,
    ApiHandler(userController.bulkDestroy),
);
