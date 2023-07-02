import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const dataSchema = Joi.object({
    name: Joi.string().required().min(3),
});

export const validateCreateRequest = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { name } = request.body;
        await dataSchema.validateAsync({ name });

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
        // const { name } = request.body;
        // await dataSchema.validateAsync({ name });

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
