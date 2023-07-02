import { Router } from 'express';
import * as membershipController from './membership-controller';
import {
    validateCreateRequest,
    validateUpdateRequest,
    validateRequestWithId,
} from './membership-validator';
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';
export const membershipsRoutes: Router = Router();

// ** use apiAuthHandler to protect a route

/**
 * @swagger
 * tags:
 *   name: Membership
 *   description: Membership operations
 */

/**
 * @swagger
 * /membership:
 *   get:
 *     summary: Get all memberships by pagination
 *     tags: [Membership]
 *     description: Retrieve a list of all memberships.
 *     parameters:
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of memberships to return per page.
 *       - in: query
 *         name: current_page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The current page number.
 *     responses:
 *       200:
 *         description: A list of memberships[].
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membersip'
 */
membershipsRoutes.get('/membership', ApiHandler(membershipController.getAll));

/**
 * @swagger
 * /membership:
 *   post:
 *     summary: Create a new membership
 *     tags: [Membership]
 *     description: Create a new membership.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membership'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created membership.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 */
membershipsRoutes.post(
    '/membership',
    protectRoute,
    validateCreateRequest,
    ApiHandler(membershipController.create),
);

/**
 * @swagger
 * /membership/{id}:
 *   get:
 *     summary: Get a membership by ID
 *     tags: [Membership]
 *     description: Retrieve a membership by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the membership to retrieve.
 *     responses:
 *       200:
 *         description: The retrieved membership.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 */
membershipsRoutes.get(
    '/membership/:id',
    // protectRoute,
    validateRequestWithId,
    ApiHandler(membershipController.getById),
);

/**
 * @swagger
 * /membership/{id}:
 *   patch:
 *     summary: Update a membership
 *     tags: [Membership]
 *     description: Update an existing membership by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the membership to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membership'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The updated membership.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Membership'
 */
membershipsRoutes.patch(
    '/membership/:id',
    protectRoute,
    validateUpdateRequest,
    ApiHandler(membershipController.update),
);

/**
 * @swagger
 * /membership/{id}:
 *   delete:
 *     summary: Delete a membership
 *     tags: [Membership]
 *     description: Delete an existing membership by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the membership to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Membership successfully deleted.
 */
membershipsRoutes.delete(
    '/membership/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(membershipController.destroy),
);

/**
 * @swagger
 * /bulk/membership:
 *   post:
 *     summary: Bulk create memberships
 *     tags: [Membership]
 *     description: Create multiple memberships in bulk using a CSV file.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: CSV file containing membership data.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created memberships.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membership'
 */
membershipsRoutes.post(
    '/bulk/membership',
    protectRoute,
    ApiHandler(membershipController.bulkCreate),
);

/**
 * @swagger
 * /bulk/membership:
 *   delete:
 *     summary: Bulk delete memberships
 *     tags: [Membership]
 *     description: Delete multiple memberships in bulk.
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
 *               ids: ["membership1", "membership2", "membership3"]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Memberships successfully deleted.
 */
membershipsRoutes.delete(
    '/bulk/membership',
    protectRoute,
    ApiHandler(membershipController.bulkDestroy),
);
