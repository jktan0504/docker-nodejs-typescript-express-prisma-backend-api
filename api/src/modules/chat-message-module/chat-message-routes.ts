import { Router } from 'express';
import * as chatMessageController from './chat-message-controller';
import {
    validateCreateRequest,
    validateUpdateRequest,
    validateRequestWithId,
} from './chat-message-validator';
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';
export const chatmessageListRoutes: Router = Router();

// ** use apiAuthHandler to protect a route

/**
 * @swagger
 * tags:
 *   name: ChatMessageList
 *   description: ADMIN ONLY ChatMessageList operations mainly used by admin thru dashboard portal
 */
/**
 * @swagger
 * /chat-message-list:
 *   get:
 *     summary: Get all chatmessages by pagination
 *     tags: [ChatMessageList]
 *     description: Retrieve a list of all chatmessages.
 *     parameters:
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of chatmessages to return per page.
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
 *         description: A list of chatmessages[].
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChatMessage'
 */
chatmessageListRoutes.get(
    '/chat-message-list',
    protectRoute,
    // validateCreateRequest,
    ApiHandler(chatMessageController.getAll),
);

/**
 * @swagger
 * /chat-messaage-list:
 *   post:
 *     summary: Create a new chatmessage
 *     tags: [ChatMessageList]
 *     description: Create a new chatmessage.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessage'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created provider.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 */
chatmessageListRoutes.post(
    '/chat-message-list',
    protectRoute,
    // validateCreateRequest,
    ApiHandler(chatMessageController.create),
);

/**
 * @swagger
 * /chat-message-list/{id}:
 *   get:
 *     summary: Get a chatmessage by ID
 *     tags: [ChatMessageList]
 *     description: Retrieve a chatmessage by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chatmessage to retrieve.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The retrieved chatroom.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 */
chatmessageListRoutes.get(
    '/chat-message-list/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(chatMessageController.getById),
);

/**
 * @swagger
 * /chat-message-list/{id}:
 *   patch:
 *     summary: Update a chatmessage
 *     tags: [ChatMessageList]
 *     description: Update an existing chatmessage by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chatmessage to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessage'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The updated chatmessage.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 */
chatmessageListRoutes.patch(
    '/chat-message-list/:id',
    protectRoute,
    // validateUpdateRequest,
    ApiHandler(chatMessageController.update),
);

/**
 * @swagger
 * /chat-message-list//{id}:
 *   delete:
 *     summary: Delete a chatmessage
 *     tags: [ChatMessageList]
 *     description: Delete an existing chatmessage by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chatmessage to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: ChatMessage successfully deleted.
 */
chatmessageListRoutes.delete(
    '/chat-message-list/:id',
    protectRoute,
    validateRequestWithId,
    ApiHandler(chatMessageController.destroy),
);

/**
 * @swagger
 * /bulk/chatroom-message-list:
 *   post:
 *     summary: Bulk create chatmessages
 *     tags: [ChatMessageList]
 *     description: Create multiple chatmessages in bulk using a CSV file.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: CSV file containing chatmessage data.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: The created chatmessages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChatMessage'
 */
chatmessageListRoutes.post(
    '/bulk/chat-message-list',
    protectRoute,
    ApiHandler(chatMessageController.bulkCreate),
);

/**
 * @swagger
 * /bulk/chatroom-message-list:
 *   delete:
 *     summary: Bulk delete chatmessages
 *     tags: [ChatMessageList]
 *     description: Delete multiple chatmessages in bulk.
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
 *               ids: ["chatmessage1", "chatmessage2", "chatmessage3"]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Chatmessage successfully deleted.
 */
chatmessageListRoutes.delete(
    '/bulk/chat-message-list',
    protectRoute,
    ApiHandler(chatMessageController.bulkDestroy),
);
