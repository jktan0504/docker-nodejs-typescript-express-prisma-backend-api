import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { Influencer } from './influencer-prisma-model';

const nameInUse = async (full_name: string) =>
    Object.keys(await Influencer.getBy({ full_name })).length > 0;

const dataSchema = Joi.object({
    full_name: Joi.string().required().min(3),
});

export const validateCreateRequest = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        // if (await nameInUse(request.body.username)) {
        //     return response
        //         .status(422)
        //         .json({ data: { message: 'username is in use' } });
        // }

        const { full_name } = request.body;
        await dataSchema.validateAsync({ full_name });

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
