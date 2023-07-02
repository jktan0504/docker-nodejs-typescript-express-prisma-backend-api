import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { User } from './user-prisma-model';
import { IUser } from '../common/interfaces';

export const emailInUse = async (email: string) =>
    Object.keys(await User.getBy({ email })).length > 0;

export const appleDeviceIDInUse = async (apple_device_id: string) =>
    Object.keys(await User.getBy({ apple_device_id })).length > 0;

const dataSchema = Joi.object({
    email: Joi.string().required().email(),
});

export const validateCreateRequest = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const data = request.body as IUser;
        if (await emailInUse(data.email)) {
            return response
                .status(422)
                .json({ data: { message: 'email is in use' } });
        }

        const { email } = request.body;
        await dataSchema.validateAsync({ email });

        next();
    } catch (error) {
        return response.status(422).json({ error });
    }
};

export const validateUpdateRequest = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        // const { username } = request.body;
        // await dataSchema.validateAsync({ username });

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
