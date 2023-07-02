import { Router } from 'express';
import * as authController from './auth-controller';
import {
    validateLoginRequest,
    validateRequestWithId,
    validateSocialLoginRequest,
} from './auth-validator';
import {
    ApiHandler,
    apiAuthHandler as protectRoute,
} from '../common/middlewares';
import { upload } from '../common/utils/multer';
export const authRoutes: Router = Router();

// ** use apiAuthHandler to protect a route

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Auth operations
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/RegisterFormData'
 *     responses:
 *       201:
 *         description: Registration successful.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
authRoutes.post(
    '/register',
    // protectRoute,
    // validateCreateRequest,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    ApiHandler(authController.register),
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     description: Authenticate user credentials and generate access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 required: true
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Invalid credentials.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
authRoutes.post(
    '/login',
    // protectRoute,
    validateLoginRequest,
    ApiHandler(authController.login),
);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     description: Invalidate the user's access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *                 description: User's email address.
 *     responses:
 *       204:
 *         description: Logout successful.
 *       401:
 *         description: Unauthorized request.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
authRoutes.post(
    '/logout',
    // protectRoute,
    // validateLoginRequest,
    ApiHandler(authController.logOut),
);

/**
 * @swagger
 * /create-login-account:
 *   post:
 *     summary: Create / Login Account
 *     tags: [Authentication]
 *     description: Authenticate user by create/login account and generate access token.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SocialLoginFormData'
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Invalid credentials.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
authRoutes.post(
    '/create-login-account',
    // protectRoute,
    validateSocialLoginRequest,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    ApiHandler(authController.createLoginAccount),
);

/**
 * @swagger
 * /social-login:
 *   post:
 *     summary: Social login
 *     tags: [Authentication]
 *     description: Authenticate user using social media account and generate access token.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SocialLoginFormData'
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Invalid credentials.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
authRoutes.post(
    '/social-login',
    // protectRoute,
    validateSocialLoginRequest,
    upload.fields([{ name: 'avatar', maxCount: 1 }]),
    ApiHandler(authController.socialLogin),
);

/**
 * @swagger
 * /forget-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     description: Request password reset for a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *                 description: User's email address.
 *     responses:
 *       200:
 *         description: Password reset request successful.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
authRoutes.post(
    '/forget-password',
    // protectRoute,
    // validateLoginRequest,
    ApiHandler(authController.requestForgetPassword),
);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     description: Reset password for a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 required: true
 *                 description: Reset password token.
 *               password:
 *                 type: string
 *                 required: true
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Password reset successful.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
authRoutes.post(
    '/reset-password',
    // protectRoute,
    // validateLoginRequest,
    ApiHandler(authController.resetPassword),
);
