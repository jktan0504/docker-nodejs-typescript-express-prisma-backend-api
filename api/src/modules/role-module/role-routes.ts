import { Router } from 'express';
import * as roleController from './role-controller';
import {
    validateCreateRequest,
    validateUpdateRequest,
    validateRequestWithId,
} from './role-validator';
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';
export const rolesRoutes: Router = Router();

// ** use apiAuthHandler to protect a route

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role operations
 */

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Get all roles by pagination
 *     tags: [Role]
 *     description: Retrieve a list of all roles.
 *     parameters:
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of roles to return per page.
 *       - in: query
 *         name: current_page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The current page number.
 *     responses:
 *       200:
 *         description: A list of roles[].
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
rolesRoutes.get('/role', ApiHandler(roleController.getAll));

/**
 * @swagger
 * /role:
 *   post:
 *     summary: Create a new role
 *     tags: [Role]
 *     description: Create a new role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created role.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 */
rolesRoutes.post(
    '/role',
    protectRoute,
    validateCreateRequest,
    ApiHandler(roleController.create),
);

/**
 * @swagger
 * /role/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Role]
 *     description: Retrieve a role by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role to retrieve.
 *     responses:
 *       200:
 *         description: The retrieved role.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 */
rolesRoutes.get(
    '/role/:id',
    // protectRoute,
    validateRequestWithId,
    ApiHandler(roleController.getById),
);

/**
 * @swagger
 * /role/{id}:
 *   patch:
 *     summary: Update a role
 *     tags: [Role]
 *     description: Update an existing role by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The updated role.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 */
rolesRoutes.patch(
    '/role/:id',
    protectRoute,
    validateUpdateRequest,
    ApiHandler(roleController.update),
);

/**
 * @swagger
 * /role/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Role]
 *     description: Delete an existing role by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Role successfully deleted.
 */
rolesRoutes.delete(
    '/role/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(roleController.destroy),
);

/**
 * @swagger
 * /bulk/role:
 *   post:
 *     summary: Bulk create roles
 *     tags: [Role]
 *     description: Create multiple roles in bulk using a CSV file.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: CSV file containing roles data.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created roles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
rolesRoutes.post(
    '/bulk/role',
    protectRoute,
    ApiHandler(roleController.bulkCreate),
);

/**
 * @swagger
 * /bulk/role:
 *   delete:
 *     summary: Bulk delete roles
 *     tags: [Role]
 *     description: Delete multiple roles in bulk.
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
 *               ids: ["role1", "role2", "role3"]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Roles successfully deleted.
 */
rolesRoutes.delete(
    '/bulk/role',
    protectRoute,
    ApiHandler(roleController.bulkDestroy),
);
