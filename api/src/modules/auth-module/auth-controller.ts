import { Request, Response } from 'express';
// import { Provider } from "./provider-knex-model";
import { User } from '../user-module/user-prisma-model';
import { PasswordReset } from '../auth-module/forget-password-prisma-model';
import {
    IUser,
    IUserQueryOptions,
    IPaginateParams,
    IApiHandlerResponse,
    IPasswordReset,
} from '../common/interfaces';
import { getS3Object } from '../common/utils/s3-client';
import { genId } from '../common/prisma.module';
import { DataBaseTables } from '../common/enums';
import {
    uploadFileToS3,
    generateSignedUrl,
    hashedPassword,
    checkComparePassword,
    generateAccessToken,
} from '../common/utils';

import * as dotenv from 'dotenv';
import { appleDeviceIDInUse, emailInUse } from '../user-module/user-validator';

import crypto from 'crypto';
import { getDateTimestampNow } from '../common/utils/date';
import { sendEmail } from '../common/utils/mail';
import { underline } from 'telegraf/typings/format';
import logger from '../common/utils/logger';

dotenv.config({});

const TABLE_NAME = DataBaseTables.USERS_TABLE.toUpperCase();

// Login
export const login = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IUser;

        const user = await User.getBy({ email: data.email });

        if (!user[0]) {
            return {
                statusCode: 404,
                error: 'user not found',
                message: `RESPONSE_AUTH_LOGIN_404`,
            };
        }

        const match = await checkComparePassword(
            data.password ?? '',
            user[0].password ?? '',
        );

        if (!match) {
            return {
                statusCode: 401,
                error: 'email and password not match',
                message: `RESPONSE_AUTH_LOGIN_401`,
            };
        }

        const accessToken = await generateAccessToken(
            user[0],
            process.env.TOKEN_PREFIX ?? 'celebapi',
            'celebapi',
        );

        const result = {
            access_token: accessToken,
            user: user[0],
        };

        return {
            statusCode: 200,
            data: result,
            message: `RESPONSE_AUTH_LOGIN_200`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 401,
            error: JSON.stringify(e),
            message: `RESPONSE_AUTH_LOGIN_401`,
        };
    }
};

// Register
export const register = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IUser;
        data.id = genId();

        if ('email' in data) {
            if (await emailInUse(data.email)) {
                return {
                    statusCode: 422,
                    error: `duplicate email address found`,
                    message: `RESPONSE_AUTH_REGISTER_422`,
                };
            }
        }

        if (
            'password' in data &&
            data.password != '' &&
            data.password != null &&
            data.password != 'underline'
        ) {
            const hashedP = await hashedPassword(data.password as string);
            data.password = hashedP as string;
        }

        // check is avatar file found
        const hasAvatarImageFile =
            'files' in request && 'avatar' in request.files;
        if (hasAvatarImageFile) {
            const avatarFile = request.files['avatar'][0];
            if (avatarFile) {
                const fileKey = `${TABLE_NAME}/${data.id}/avatar.png`;
                // upload to s3
                await uploadFileToS3(
                    avatarFile!,
                    process.env.AWS_S3_BUCKET_NAME!,
                    fileKey,
                );

                const { uploadUrl } = await generateSignedUrl({
                    Bucket: process.env.AWS_S3_BUCKET_NAME!,
                    Key: fileKey,
                });

                data.avatar = uploadUrl ?? '';
            }
        }

        const newData = await User.create(data);
        if (newData) {
            const accessToken = await generateAccessToken(
                newData,
                process.env.TOKEN_PREFIX ?? 'celebapi',
                'celebapi',
            );

            const result = {
                access_token: accessToken,
                user: newData,
            };

            return {
                statusCode: 201,
                data: result,
                message: `RESPONSE_AUTH_REGISTER_201`,
            };
        }
        return {
            statusCode: 400,
            error: `register failed`,
            message: `RESPONSE_AUTH_REGISTER_400`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_AUTH_REGISTER_400`,
        };
    }
};

// LogOut
export const logOut = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IUser;

        const user = await User.getBy({ email: data.email });

        if (!user[0]) {
            return {
                statusCode: 404,
                error: 'user not found',
                message: `RESPONSE_AUTH_LOGOUT_404`,
            };
        }

        return {
            statusCode: 204,
            data: {},
            message: `RESPONSE_AUTH_LOGOUT_204`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 401,
            error: JSON.stringify(e),
            message: `RESPONSE_AUTH_LOGOUT_401`,
        };
    }
};

// Combine Create & Login Account
export const createLoginAccount = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IUser;

        if (!('email' in data) && !('apple_device_id' in data)) {
            return {
                statusCode: 400,
                error: 'email and apple_device_id must have either one',
                message: `RESPONSE_AUTH_SOCIAL_LOGIN_400`,
            };
        }

        if (
            'email' in data &&
            data.email !== null &&
            data.email !== '' &&
            data.email !== 'underline'
        ) {
            if (await emailInUse(data.email)) {
                const user = await User.getBy({ email: data.email });

                if (!user[0]) {
                    return {
                        statusCode: 404,
                        error: 'user not found',
                        message: `RESPONSE_AUTH_SOCIAL_LOGIN_404`,
                    };
                }

                const accessToken = await generateAccessToken(
                    user[0],
                    process.env.TOKEN_PREFIX ?? 'celebapi',
                    'celebapi',
                );

                const result = {
                    access_token: accessToken,
                    user: user[0],
                };

                return {
                    statusCode: 200,
                    data: result,
                    message: `RESPONSE_AUTH_SOCIAL_LOGIN_200`,
                };
            }
        }

        if (
            'apple_device_id' in data &&
            data.apple_device_id !== null &&
            data.apple_device_id !== '' &&
            data.apple_device_id !== 'underline'
        ) {
            if (await appleDeviceIDInUse(data.apple_device_id!)) {
                const user = await User.getBy({
                    apple_device_id: data.apple_device_id!,
                });

                if (!user[0]) {
                    return {
                        statusCode: 404,
                        error: 'user not found',
                        message: `RESPONSE_AUTH_SOCIAL_LOGIN_404`,
                    };
                }

                const accessToken = await generateAccessToken(
                    user[0],
                    process.env.TOKEN_PREFIX ?? 'celebapi',
                    'celebapi',
                );

                const result = {
                    access_token: accessToken,
                    user: user[0],
                };

                return {
                    statusCode: 200,
                    data: result,
                    message: `RESPONSE_AUTH_SOCIAL_LOGIN_200`,
                };
            }
        }

        data.id = genId();

		if (
            'password' in data &&
            data.password != '' &&
            data.password != null &&
            data.password != 'underline'
        ) {
            const hashedP = await hashedPassword(data.password as string);
            data.password = hashedP as string;
        } else {
			data.password = '';
		}
        
        // check is avatar file found
        const hasAvatarImageFile =
            'files' in request && 'avatar' in request.files;
        if (hasAvatarImageFile) {
            const avatarFile = request.files['avatar'][0];
            if (avatarFile) {
                const fileKey = `${TABLE_NAME}/${data.id}/avatar.png`;
                // upload to s3
                await uploadFileToS3(
                    avatarFile!,
                    process.env.AWS_S3_BUCKET_NAME!,
                    fileKey,
                );

                const { uploadUrl } = await generateSignedUrl({
                    Bucket: process.env.AWS_S3_BUCKET_NAME!,
                    Key: fileKey,
                });

                data.avatar = uploadUrl ?? '';
            }
        }

        const newData = await User.create(data);
        if (newData) {
            const accessToken = await generateAccessToken(
                newData,
                process.env.TOKEN_PREFIX ?? 'celebapi',
                'celebapi',
            );

            const result = {
                access_token: accessToken,
                user: newData,
            };

            return {
                statusCode: 200,
                data: result,
                message: `RESPONSE_AUTH_SOCIAL_LOGIN_200`,
            };
        }
        return {
            statusCode: 400,
            error: `register failed`,
            message: `RESPONSE_AUTH_SOCIAL_LOGIN_400`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_AUTH_SOCIAL_LOGIN_400`,
        };
    }
};

// Social Login
export const socialLogin = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IUser;

        if (!('email' in data) && !('apple_device_id' in data)) {
            return {
                statusCode: 400,
                error: 'email and apple_device_id must have either one',
                message: `RESPONSE_AUTH_SOCIAL_LOGIN_400`,
            };
        }

        if (
            'email' in data &&
            data.email !== null &&
            data.email !== '' &&
            data.email !== 'underline'
        ) {
            if (await emailInUse(data.email)) {
                const user = await User.getBy({ email: data.email });

                if (!user[0]) {
                    return {
                        statusCode: 404,
                        error: 'user not found',
                        message: `RESPONSE_AUTH_SOCIAL_LOGIN_404`,
                    };
                }

                const accessToken = await generateAccessToken(
                    user[0],
                    process.env.TOKEN_PREFIX ?? 'celebapi',
                    'celebapi',
                );

                const result = {
                    access_token: accessToken,
                    user: user[0],
                };

                return {
                    statusCode: 200,
                    data: result,
                    message: `RESPONSE_AUTH_SOCIAL_LOGIN_200`,
                };
            }
        }

        if (
            'apple_device_id' in data &&
            data.apple_device_id !== null &&
            data.apple_device_id !== '' &&
            data.apple_device_id !== 'underline'
        ) {
            if (await appleDeviceIDInUse(data.apple_device_id!)) {
                const user = await User.getBy({
                    apple_device_id: data.apple_device_id!,
                });

                if (!user[0]) {
                    return {
                        statusCode: 404,
                        error: 'user not found',
                        message: `RESPONSE_AUTH_SOCIAL_LOGIN_404`,
                    };
                }

                const accessToken = await generateAccessToken(
                    user[0],
                    process.env.TOKEN_PREFIX ?? 'celebapi',
                    'celebapi',
                );

                const result = {
                    access_token: accessToken,
                    user: user[0],
                };

                return {
                    statusCode: 200,
                    data: result,
                    message: `RESPONSE_AUTH_SOCIAL_LOGIN_200`,
                };
            }
        }

        data.id = genId();
        data.password = '';

        // check is avatar file found
        const hasAvatarImageFile =
            'files' in request && 'avatar' in request.files;
        if (hasAvatarImageFile) {
            const avatarFile = request.files['avatar'][0];
            if (avatarFile) {
                const fileKey = `${TABLE_NAME}/${data.id}/avatar.png`;
                // upload to s3
                await uploadFileToS3(
                    avatarFile!,
                    process.env.AWS_S3_BUCKET_NAME!,
                    fileKey,
                );

                const { uploadUrl } = await generateSignedUrl({
                    Bucket: process.env.AWS_S3_BUCKET_NAME!,
                    Key: fileKey,
                });

                data.avatar = uploadUrl ?? '';
            }
        }

        const newData = await User.create(data);
        if (newData) {
            const accessToken = await generateAccessToken(
                newData,
                process.env.TOKEN_PREFIX ?? 'celebapi',
                'celebapi',
            );

            const result = {
                access_token: accessToken,
                user: newData,
            };

            return {
                statusCode: 200,
                data: result,
                message: `RESPONSE_AUTH_SOCIAL_LOGIN_200`,
            };
        }
        return {
            statusCode: 400,
            error: `register failed`,
            message: `RESPONSE_AUTH_SOCIAL_LOGIN_400`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_AUTH_SOCIAL_LOGIN_400`,
        };
    }
};

// Forget Password Request
export const requestForgetPassword = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IPasswordReset;

        const user = await User.getBy({ email: data.email });

        if (!user[0]) {
            return {
                statusCode: 404,
                error: 'user not found',
                message: `RESPONSE_AUTH_LOGIN_404`,
            };
        }

        // Generate token
        data.token = crypto.randomBytes(32).toString('hex');

        // Timestamp
        // data.created_at =  getDateTimestampNow()
        // data.updated_at =  getDateTimestampNow()

        const newData = await PasswordReset.create(data);
        if (newData) {
            // Send email with reset link
            const link = `https://celebapi.com/reset-password/${data.token}`;
            const content = `
				<h1>Reset Password</h1>
				<h5>You may click the link below to reset your password</h5>
				<h6>https://celebapi.com/reset-password/${data.token}</h6>
			`;
            await sendEmail(data.email!, 'Reset your password', link);

            return {
                statusCode: 201,
                data: newData,
                message: `RESPONSE_FORGET_PASSWORD_RESET_201`,
            };
        }

        return {
            statusCode: 400,
            error: `forget password request failed`,
            message: `RESPONSE_FORGET_PASSWORD_RESET_400`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 401,
            error: JSON.stringify(e),
            message: `RESPONSE_AUTH_LOGIN_401`,
        };
    }
};

// reset password
export const resetPassword = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IPasswordReset;

        const passwordReset = await PasswordReset.getBy({ token: data.token });

        if (!passwordReset[0]) {
            return {
                statusCode: 404,
                error: 'invalid token',
                message: `RESPONSE_RESET_PASSWORD_404`,
            };
        }

        const user = await User.getBy({ email: passwordReset[0].email! });

        if (!user[0]) {
            return {
                statusCode: 404,
                error: 'user not found',
                message: `RESPONSE_AUTH_LOGIN_404`,
            };
        }

        if (
            'password' in data &&
            data.password != '' &&
            data.password != null &&
            data.password != 'underline'
        ) {
            const hashedP = await hashedPassword(data.password as string);
            user[0].password = hashedP as string;
        }

        const updatedData: IUser = {
            id: user[0].id,
            email: user[0].email!,
            password: user[0].password!,
        };

        await User.update(user[0].id, updatedData);

        return {
            statusCode: 200,
            data: updatedData,
            message: `RESPONSE_RESET_PASSWORD_200`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 401,
            error: JSON.stringify(e),
            message: `RESPONSE_RESET_PASSWORD_401`,
        };
    }
};
