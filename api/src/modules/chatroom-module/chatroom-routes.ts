import { Router } from 'express';
import * as chatroomController from './chatroom-controller';
import {
    validateCreateRequest,
    validateUpdateRequest,
    validateRequestWithId,
} from './chatroom-validator';
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';
export const chatroomsListRoutes: Router = Router();

// ** use apiAuthHandler to protect a route

/**
 * @swagger
 * tags:
 *   name: ChatroomList
 *   description: ADMIN ONLY ChatroomList operations mainly used by admin thru dashboard portal
 */

/**
 * @swagger
 * /chatroom-list':
 *   get:
 *     summary: Get all chatrooms by pagination
 *     tags: [ChatroomList]
 *     description: Retrieve a list of all chatrooms.
 *     parameters:
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of chatrooms to return per page.
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
 *         description: A list of chatrooms[].
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chatroom'
 */
chatroomsListRoutes.get(
    '/chatroom-list',
    protectRoute,
    // validateCreateRequest,
    ApiHandler(chatroomController.getAll),
);

/**
 * @swagger
 * /chatroom-list:
 *   post:
 *     summary: Create a new chatroom
 *     tags: [ChatroomList]
 *     description: Create a new chatroom.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chatroom'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created chatroom.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chatroom'
 */
chatroomsListRoutes.post(
    '/chatroom-list',
    protectRoute,
    // validateCreateRequest,
    ApiHandler(chatroomController.create),
);

/**
 * @swagger
 * /chatroom-list/{id}:
 *   get:
 *     summary: Get a chatroom by ID
 *     tags: [ChatroomList]
 *     description: Retrieve a chatroom by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chatroom to retrieve.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The retrieved chatroom.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chatroom'
 */
chatroomsListRoutes.get(
    '/chatroom-list/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(chatroomController.getById),
);

/**
 * @swagger
 * /chatroom-list/{id}:
 *   patch:
 *     summary: Update a chatroom
 *     tags: [ChatroomList]
 *     description: Update an existing chatroom by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chatroom to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chatroom'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The updated chatroom.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chatroom'
 */
chatroomsListRoutes.patch(
    '/chatroom-list/:id',
    protectRoute,
    // validateUpdateRequest,
    ApiHandler(chatroomController.update),
);

/**
 * @swagger
 * /chatroom-list/{id}:
 *   delete:
 *     summary: Delete a chatroom
 *     tags: [ChatroomList]
 *     description: Delete an existing chatroom by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chatroom to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Chatroom successfully deleted.
 */
chatroomsListRoutes.delete(
    '/chatroom-list/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(chatroomController.destroy),
);

/**
 * @swagger
 * /bulk/chatroom-list:
 *   post:
 *     summary: Bulk create chatrooms
 *     tags: [ChatroomList]
 *     description: Create multiple chatrooms in bulk using a CSV file.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: CSV file containing chatroom data.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created chatrooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chatroom'
 */
chatroomsListRoutes.post(
    '/bulk/chatroom-list',
    protectRoute,
    ApiHandler(chatroomController.bulkCreate),
);

/**
 * @swagger
 * /bulk/chatroom-list:
 *   delete:
 *     summary: Bulk delete chatrooms
 *     tags: [ChatroomList]
 *     description: Delete multiple chatrooms in bulk.
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
 *               ids: ["chatroom1", "chatroom2", "chatroom3"]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Chatrooms successfully deleted.
 */
chatroomsListRoutes.delete(
    '/bulk/chatroom-list',
    protectRoute,
    ApiHandler(chatroomController.bulkDestroy),
);
