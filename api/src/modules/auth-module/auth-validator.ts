import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user-module/user-prisma-model';
import { IUser } from '../common/interfaces';

const dataSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
});

const socialLoginDataSchema = Joi.object({
    email: Joi.string().email(),
    apple_device_id: Joi.string(),
});

export const validateLoginRequest = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const data = request.body as IUser;

        const { email, password } = request.body;
        await dataSchema.validateAsync({ email, password });

        next();
    } catch (error) {
        return response.status(422).json({ error });
    }
};

export const validateSocialLoginRequest = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { email, apple_device_id } = request.body as IUser;
        await socialLoginDataSchema.validateAsync({ email, apple_device_id });

        next();
    } catch (error) {
        return response.status(422).json({ error });
    }
};

export const validateRequestWithId = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { id } = request.params;
        if (!id) {
            return response
                .status(422)
                .json({ error: 'id params is required' });
        }

        next();
    } catch (error) {
        return response.status(422).json({ error });
    }
};
