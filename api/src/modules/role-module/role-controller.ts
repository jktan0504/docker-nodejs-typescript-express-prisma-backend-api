import { Request, Response } from 'express';
// import { Provider } from "./provider-knex-model";
import { Role } from './role-prisma-model';
import {
    IRole,
    IRoleQueryOptions,
    IPaginateParams,
    IApiHandlerResponse,
} from '../common/interfaces';
import { getS3Object } from '../common/utils/s3-client';
import { genId } from '../common/prisma.module';
import { DataBaseTables } from '../common/enums';

import * as dotenv from 'dotenv';
import logger from '../common/utils/logger';

dotenv.config({});

const TABLE_NAME = DataBaseTables.ROLES_TABLE.toUpperCase();

export const create = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const data = request.body as IRole;
        data.id = genId();
        const newData = await Role.create(data);
        if (newData) {
            return {
                statusCode: 201,
                data: newData,
                message: `RESPONSE_CREATE_${TABLE_NAME}_201`,
            };
        }
        return {
            statusCode: 400,
            error: 'created data failed',
            message: `RESPONSE_CREATE_${TABLE_NAME}_400`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_CREATE_${TABLE_NAME}_400`,
        };
    }
};

export const getAll = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        // handle pagination
        const { per_page, current_page } =
            request.query as unknown as IPaginateParams;

        if (per_page && current_page) {
            const { data: data, meta: meta } = await Role.getAllPaginate({
                per_page,
                current_page,
            });

            if (!data) {
                return {
                    statusCode: 400,
                    error: 'data not found',
                    message: `RESPONSE_GET_${TABLE_NAME}_400`,
                };
            }

            return {
                statusCode: 200,
                data,
                meta,
                message: `RESPONSE_GET_${TABLE_NAME}_200`,
            };
        }

        // Handle search operation
        const query: IRoleQueryOptions = request.query;
        if (query) {
            const result = await Role.getBy(query);
            if (!result) {
                return {
                    statusCode: 404,
                    error: 'data not found',
                    message: `RESPONSE_GET_${TABLE_NAME}_404`,
                };
            }

            return {
                statusCode: 200,
                data: result,
                message: `RESPONSE_GET_${TABLE_NAME}_200`,
            };
        }

        // handle get all ( not recommended )
        const data = await Role.getAll();
        return {
            statusCode: 200,
            data,
            message: `RESPONSE_GET_${TABLE_NAME}_200`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 404,
            error: JSON.stringify(e),
            message: `RESPONSE_GET_${TABLE_NAME}_404`,
        };
    }
};

export const getById = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const { id } = request.params;
        if (!id) {
            return {
                statusCode: 404,
                error: 'data not found',
                message: `RESPONSE_GET_${TABLE_NAME}_404`,
            };
        }

        const data = await Role.getById(id);

        if (!data) {
            return {
                statusCode: 404,
                error: 'data not found',
                message: `RESPONSE_GET_${TABLE_NAME}_404`,
            };
        }

        return {
            statusCode: 200,
            data: data,
            message: `RESPONSE_GET_${TABLE_NAME}_200`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 404,
            error: JSON.stringify(e),
            message: `RESPONSE_GET_${TABLE_NAME}_404`,
        };
    }
};

export const update = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const { id } = request.params;
        if (!id) {
            return {
                statusCode: 404,
                error: 'data not found',
                message: `RESPONSE_GET${TABLE_NAME}_404`,
            };
        }
        const data = request.body as IRole;
        data.id = id;
        await Role.update(id, data);
        await Role.getById(id);

        return {
            statusCode: 200,
            data: data,
            message: `RESPONSE_UPDATE_${TABLE_NAME}_200`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_UPDATE_${TABLE_NAME}_400`,
        };
    }
};

export const destroy = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const { id } = request.params;
        if (!id) {
            return {
                statusCode: 404,
                error: 'data not found',
                message: `RESPONSE_GET_${TABLE_NAME}_404`,
            };
        }

        await Role.delete(id);
        return {
            statusCode: 204,
            data: {},
            message: `RESPONSE_DELETE_${TABLE_NAME}_204`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_DELETE_${TABLE_NAME}_400`,
        };
    }
};

export const bulkCreate = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const { key } = request.body;

        if (!key) {
            return {
                statusCode: 400,
                error: 'key param is required',
                message: `RESPONSE_BULK_CREATE_${TABLE_NAME}_400`,
            };
        }

        const { data: dataRecords, errors } = await getS3Object({
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Key: key,
        });

        if (Array.isArray(errors) && errors.length > 0) {
            return {
                statusCode: 400,
                error: errors.join(', '),
                message: `RESPONSE_BULK_CREATE_${TABLE_NAME}_400`,
            };
        }

        const data = await Role.bulKCreate(dataRecords as IRole[]);

        return {
            statusCode: 201,
            data: dataRecords,
            message: `RESPONSE_BULK_CREATE_${TABLE_NAME}_201`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_BULK_CREATE_${TABLE_NAME}_400`,
        };
    }
};

export const bulkDestroy = async (
    request: Request,
    _response: Response,
): Promise<IApiHandlerResponse> => {
    try {
        const { ids } = request.body;

        if (Array.isArray(ids) && ids.length > 0) {
            await Role.bulKDelete(ids);
            return {
                statusCode: 204,
                data: {},
                message: `RESPONSE_BULK_DELETE_${TABLE_NAME}_204`,
            };
        }

        return {
            statusCode: 204,
            data: {},
            message: `RESPONSE_BULK_DELETE_${TABLE_NAME}_204`,
        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 400,
            error: JSON.stringify(e),
            message: `RESPONSE_BULK_CREATE_${TABLE_NAME}_400`,
        };
    }
};
