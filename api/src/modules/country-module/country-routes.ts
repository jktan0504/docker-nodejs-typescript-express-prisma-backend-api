import { Router } from 'express';
import * as countryController from './country-controller';
import {
    validateCreateRequest,
    validateUpdateRequest,
    validateRequestWithId,
} from './country-validator';
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';
export const countriesRoutes: Router = Router();

// ** use apiAuthHandler to protect a route

/**
 * @swagger
 * tags:
 *   name: Country
 *   description: Country operations
 */

/**
 * @swagger
 * /country:
 *   get:
 *     summary: Get all countries by pagination
 *     tags: [Country]
 *     description: Retrieve a list of all countries.
 *     parameters:
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of countries to return per page.
 *       - in: query
 *         name: current_page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The current page number.
 *     responses:
 *       200:
 *         description: A list of countries[].
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 */
countriesRoutes.get('/country', ApiHandler(countryController.getAll));

/**
 * @swagger
 * /country:
 *   post:
 *     summary: Create a new country
 *     tags: [Country]
 *     description: Create a new country.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created country.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 */
countriesRoutes.post(
    '/country',
    protectRoute,
    validateCreateRequest,
    ApiHandler(countryController.create),
);

/**
 * @swagger
 * /country/{id}:
 *   get:
 *     summary: Get a country by ID
 *     tags: [Country]
 *     description: Retrieve a country by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the country to retrieve.
 *     responses:
 *       200:
 *         description: The retrieved country.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 */
countriesRoutes.get(
    '/country/:id',
    // protectRoute,
    validateRequestWithId,
    ApiHandler(countryController.getById),
);

/**
 * @swagger
 * /country/{id}:
 *   patch:
 *     summary: Update a country
 *     tags: [Country]
 *     description: Update an existing country by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the country to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The updated country.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 */
countriesRoutes.patch(
    '/country/:id',
    protectRoute,
    validateUpdateRequest,
    ApiHandler(countryController.update),
);

/**
 * @swagger
 * /country/{id}:
 *   delete:
 *     summary: Delete a country
 *     tags: [Country]
 *     description: Delete an existing country by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the country to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Country successfully deleted.
 */
countriesRoutes.delete(
    '/country/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(countryController.destroy),
);

/**
 * @swagger
 * /bulk/country:
 *   post:
 *     summary: Bulk create countries
 *     tags: [Country]
 *     description: Create multiple countries in bulk using a CSV file.
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
 *         description: The created countries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 */
countriesRoutes.post(
    '/bulk/country',
    protectRoute,
    ApiHandler(countryController.bulkCreate),
);

/**
 * @swagger
 * /bulk/country:
 *   delete:
 *     summary: Bulk delete countries
 *     tags: [Country]
 *     description: Delete multiple countries in bulk.
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
 *               ids: ["country1", "country2", "country3"]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Countries successfully deleted.
 */
countriesRoutes.delete(
    '/bulk/country',
    protectRoute,
    ApiHandler(countryController.bulkDestroy),
);
