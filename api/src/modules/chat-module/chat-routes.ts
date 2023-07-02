import { Router } from 'express';
import * as chatController from './chat-controller';
import {
    validateCreateRequest,
    validateUpdateRequest,
    validateRequestWithId,
} from './chat-validator';
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';
export const chatRoutes: Router = Router();

// ** use apiAuthHandler to protect a route

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat operations
 */

/**
 * @swagger
 * /chatrooms:
 *   post:
 *     summary: Create a new chatroom
 *     tags: [Chat]
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
chatRoutes.post(
    '/chatrooms',
    protectRoute,
    // validateCreateRequest,
    ApiHandler(chatController.createChatroom),
);

/**
 * @swagger
 * /chatrooms/{userId}':
 *   get:
 *     summary: Get all chatrooms by userId with pagination
 *     tags: [Chat]
 *     description: Retrieve a list of all chatrooms by user Id.
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
chatRoutes.get(
    '/chatrooms/:userId',
    protectRoute,
    // validateRequestWithId,
    ApiHandler(chatController.getByUserId),
);

/**
 * @swagger
 * /chatrooms/{chatroomId}/messages':
 *   get:
 *     summary: Get all chatrooms by chatroom Id with pagination
 *     tags: [Chat]
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
chatRoutes.get(
    '/chatrooms/:chatroomId/messages',
    protectRoute,
    // validateRequestWithId,
    ApiHandler(chatController.getAllMessageByChatRoomId),
);

chatRoutes.post(
    '/chat/send-message',
    // protectRoute,
    // validateRequestWithId,
    ApiHandler(chatController.sendMessageThruAPI),
);

chatRoutes.post(
    '/chat/openai',
    protectRoute,
    // validateRequestWithId,
    ApiHandler(chatController.sendMessageGetOpenAiMessage),
);

chatRoutes.post(
    '/chat/openai-chat-completion',
    protectRoute,
    // validateRequestWithId,
    ApiHandler(chatController.sendAllPreviousMsgForOpenAI),
);

/// SOCKETS
/**
 * @swagger
 * tags:
 *   name: WebSocket
 *   description: Websocket Chat operations
 */
/**
 * @swagger
 * /chat/send-message/{chatroomId}:
 *   post:
 *     summary: Send a message to a chatroom via WebSocket
 *     tags: [WebSocket]
 *     description: Send a message to a chatroom using WebSocket communication.
 *     parameters:
 *       - in: path
 *         name: chatroomId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the chatroom to send the message to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatroom_id:
 *                 type: string
 *                 description: ID of the chatroom.
 *               influencer_id:
 *                 type: string
 *                 description: ID of the influencer.
 *               content:
 *                 type: string
 *                 description: Content of the message.
 *
 * /chat/reply-message/{chatroomId}:
 *   get:
 *     summary: Receive a message from a chatroom via WebSocket
 *     tags: [WebSocket]
 *     description: Receive a message from a chatroom using WebSocket communication.
 *     parameters:
 *       - in: path
 *         name: chatroomId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the chatroom to receive the message from.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatroom_id:
 *                 type: string
 *                 description: ID of the chatroom.
 *               influencer_id:
 *                 type: string
 *                 description: ID of the influencer.
 *               content:
 *                 type: string
 *                 description: Content of the message.
 */
