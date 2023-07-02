/**
 * @swagger
 * components:
 *   schemas:
 *     Provider:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated uuid of the provider
 *         name:
 *           type: string
 *           description: The provider name
 *         description:
 *           type: string
 *           description: The provider description
 *       example:
 *         id: Google
 *         name: Google
 *         description: Google Sign-in Provider
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Currency:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated uuid of the currency
 *         name:
 *           type: string
 *           description: The currency name
 *         code:
 *           type: string
 *           description: The currency code
 *         symbol:
 *           type: string
 *           description: The currency symbol
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated uuid of the currency
 *         name:
 *           type: string
 *           description: The country name
 *         code:
 *           type: string
 *           description: The country code
 *         timezone:
 *           type: string
 *           description: The country timezone
 *         currency_id:
 *           type: string
 *           description: Ref ID from Currency
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated uuid of the role
 *         name:
 *           type: string
 *           description: The role name
 *         description:
 *           type: string
 *           description: The role description
 *         permissions:
 *           type: json
 *           description: The role permissions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Membership:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated uuid of the membership
 *         name:
 *           type: string
 *           description: The membership name
 *         description:
 *           type: string
 *           description: The membership description
 *         price:
 *           type: double
 *           description: The membership price
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Influencer:
 *       type: object
 *       required:
 *         - username
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated uuid of the influencer
 *         username:
 *           type: string
 *           description: The influencer username
 *         full_name:
 *           type: string
 *           description: The influencer full_name
 *         bio:
 *           type: string
 *           description: The influencer bio
 *         num_of_followers:
 *           type: int
 *           description: The influencer num_of_followers
 *         avatar:
 *           type: string
 *           description: The influencer avatar
 *         role_id:
 *           type: string
 *           description: Ref ID from Role
 *         country_id:
 *           type: string
 *           description: Ref ID from Country
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated uuid of the user
 *         username:
 *           type: string
 *           description: The user username
 *         full_name:
 *           type: string
 *           description: The user full_name
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         contact_number:
 *           type: string
 *           description: The user contact_number
 *         gender:
 *           type: string
 *           description: The user gender
 *         age:
 *           type: string
 *           description: The user age
 *         avatar:
 *           type: string
 *           description: The user avatar
 *         remarks:
 *           type: string
 *           description: The user remarks
 *         apple_device_id:
 *           type: string
 *           description: The user apple_device_id
 *         role_id:
 *           type: string
 *           description: Ref ID from Role
 *         country_id:
 *           type: string
 *           description: Ref ID from Country
 *         membership_id:
 *           type: string
 *           description: Ref ID from Membership
 *         provider_id:
 *           type: string
 *           description: Ref ID from Provider
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PasswordReset:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         id:
 *           type: BigInt
 *           description: The auto-generated id of the forget password
 *         email:
 *           type: string
 *           description: The user email
 *         token:
 *           type: string
 *           description: The reset token
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chatroom:
 *       type: object
 *       required:
 *         - user_id
 *         - influencer_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated uuid of the chatroom
 *         user_id:
 *           type: string
 *           description: Ref ID from User
 *         influencer_id:
 *           type: string
 *           description: Ref ID from Influencer
 *         last_message_id:
 *           type: string
 *           description: Ref ID from ChatMessages
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatMessage:
 *       type: object
 *       required:
 *         - user_id
 *         - influencer_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated uuid of the chatroom
 *         user_id:
 *           type: string
 *           description: Ref ID from User
 *         influencer_id:
 *           type: string
 *           description: Ref ID from Influencer
 *         chatroom_id:
 *           type: string
 *           description: Ref ID from Chatroom
 *         content:
 *           type: string
 *           description: Chat Message content
 *         is_influencer:
 *           type: boolean
 *           description: check is this message created by influencer
 *         is_seen:
 *           type: boolean
 *           description: check is this message seen by user
 */
