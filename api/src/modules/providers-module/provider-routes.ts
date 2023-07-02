import { Router } from 'express';
import * as providersController from './provider-controller';
import {
    validateCreateRequest,
    validateUpdateRequest,
    validateRequestWithId,
} from './provider-validator';
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';
export const providersRoutes: Router = Router();

// ** use apiAuthHandler to protect a route

/**
 * @swagger
 * tags:
 *   name: Provider
 *   description: Provider operations
 */

/**
 * @swagger
 * /provider:
 *   get:
 *     summary: Get all providers by pagination
 *     tags: [Provider]
 *     description: Retrieve a list of all providers.
 *     parameters:
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of providers to return per page.
 *       - in: query
 *         name: current_page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The current page number.
 *     responses:
 *       200:
 *         description: A list of providers[].
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Provider'
 */
providersRoutes.get('/provider', ApiHandler(providersController.getAll));

/**
 * @swagger
 * /provider:
 *   post:
 *     summary: Create a new provider
 *     tags: [Provider]
 *     description: Create a new provider.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Provider'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created provider.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 */
providersRoutes.post(
    '/provider',
    protectRoute,
    validateCreateRequest,
    ApiHandler(providersController.create),
);

/**
 * @swagger
 * /provider/{id}:
 *   get:
 *     summary: Get a provider by ID
 *     tags: [Provider]
 *     description: Retrieve a provider by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the provider to retrieve.
 *     responses:
 *       200:
 *         description: The retrieved provider.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 */
providersRoutes.get(
    '/provider/:id',
    // protectRoute,
    validateRequestWithId,
    ApiHandler(providersController.getById),
);

/**
 * @swagger
 * /provider/{id}:
 *   patch:
 *     summary: Update a provider
 *     tags: [Provider]
 *     description: Update an existing provider by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the provider to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Provider'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The updated provider.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 */
providersRoutes.patch(
    '/provider/:id',
    protectRoute,
    validateUpdateRequest,
    ApiHandler(providersController.update),
);

/**
 * @swagger
 * /provider/{id}:
 *   delete:
 *     summary: Delete a provider
 *     tags: [Provider]
 *     description: Delete an existing provider by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the provider to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Provider successfully deleted.
 */
providersRoutes.delete(
    '/provider/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(providersController.destroy),
);

/**
 * @swagger
 * /bulk/provider:
 *   post:
 *     summary: Bulk create providers
 *     tags: [Provider]
 *     description: Create multiple providers in bulk using a CSV file.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: CSV file containing provider data.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created providers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Provider'
 */
providersRoutes.post(
    '/bulk/provider',
    protectRoute,
    ApiHandler(providersController.bulkCreate),
);

/**
 * @swagger
 * /bulk/provider:
 *   delete:
 *     summary: Bulk delete providers
 *     tags: [Provider]
 *     description: Delete multiple providers in bulk.
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
 *               ids: ["providerId1", "providerId2", "providerId3"]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Providers successfully deleted.
 */
providersRoutes.delete(
    '/bulk/provider',
    protectRoute,
    ApiHandler(providersController.bulkDestroy),
);
