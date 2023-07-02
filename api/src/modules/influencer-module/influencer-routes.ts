import { Router } from 'express';
import * as influencerController from './influencer-controller';
import {
    validateCreateRequest,
    validateUpdateRequest,
    validateRequestWithId,
} from './influencer-validator';
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';
import { upload } from '../common/utils/multer';
export const influencersRoutes: Router = Router();

// ** use apiAuthHandler to protect a route

/**
 * @swagger
 * tags:
 *   name: Influencer
 *   description: Influencer operations
 */

/**
 * @swagger
 * /influencer:
 *   get:
 *     summary: Get all influencers by pagination
 *     tags: [Influencer]
 *     description: Retrieve a list of all influencers.
 *     parameters:
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of influencers to return per page.
 *       - in: query
 *         name: current_page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The current page number.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of influencers[].
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Influencer'
 */
influencersRoutes.get(
    '/influencer',
    protectRoute,
    // validateCreateRequest,
    ApiHandler(influencerController.getAll),
);

/**
 * @swagger
 * /influencer:
 *   post:
 *     summary: Create a new influencer
 *     tags: [Influencer]
 *     description: Create a new influencer.
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
 *         description: The created influencer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Influencer'
 */
influencersRoutes.post(
    '/influencer',
    protectRoute,
    // validateCreateRequest,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    ApiHandler(influencerController.create),
);

/**
 * @swagger
 * /influencer/{id}:
 *   get:
 *     summary: Get a influencer by ID
 *     tags: [Influencer]
 *     description: Retrieve a influencer by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the influencer to retrieve.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The retrieved influencer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Influencer'
 */
influencersRoutes.get(
    '/influencer/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(influencerController.getById),
);

/**
 * @swagger
 * /influencer/{id}:
 *   patch:
 *     summary: Update an influencer
 *     tags: [Influencer]
 *     description: Update an existing influencer by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the influencer to update.
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
 *         description: The updated influencer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Influencer'
 */
influencersRoutes.patch(
    '/influencer/:id',
    protectRoute,
    // validateUpdateRequest,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    ApiHandler(influencerController.update),
);

/**
 * @swagger
 * /influencer/{id}:
 *   delete:
 *     summary: Delete a influencer
 *     tags: [Influencer]
 *     description: Delete an existing influencer by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the influencer to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Influencer successfully deleted.
 */
influencersRoutes.delete(
    '/influencer/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(influencerController.destroy),
);

/**
 * @swagger
 * /bulk/influencer:
 *   post:
 *     summary: Bulk create influencers
 *     tags: [Influencer]
 *     description: Create multiple influencers in bulk using a CSV file.
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
 *         description: The created influencers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Influencer'
 */
influencersRoutes.post(
    '/bulk/influencer',
    protectRoute,
    ApiHandler(influencerController.bulkCreate),
);

/**
 * @swagger
 * /bulk/influencer:
 *   delete:
 *     summary: Bulk delete influencers
 *     tags: [Influencer]
 *     description: Delete multiple influencers in bulk.
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
 *               ids: ["influencer1", "influencer2", "influencer3"]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Influencers successfully deleted.
 */
influencersRoutes.delete(
    '/bulk/influencer',
    protectRoute,
    ApiHandler(influencerController.bulkDestroy),
);
