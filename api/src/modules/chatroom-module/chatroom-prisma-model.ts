import {
    IPaginateParams,
    IPagination,
    IChatroom,
    IChatroomQueryOptions,
} from '../common/interfaces';
import db from '../common/prisma.module';

export class Chatroom {
    static setTable() {
        return db.chatroom;
    }

    static async getAll() {
        const data = await this.setTable().findMany({
            include: {
                user: true,
                influencer: true,
                last_message: true,
            },
        });
        return data;
    }

    static async getAllPaginate(params: IPaginateParams) {
        const per_page = Number(params.per_page);
        const current_page = Number(params.current_page);
        const data = await this.setTable().findMany({
            take: per_page,
            skip: (per_page * (current_page - 1)) as number,
            include: {
                user: true,
                influencer: true,
                last_message: true,
            },
        });

        const count = await this.setTable().count();
        const pages = Math.ceil(count / per_page);

        const pagination: IPagination = {
            total: count,
            last_page: pages,
            current_page: current_page,
            per_page: per_page,
            from: per_page * (current_page - 1) + 1,
            to: per_page * current_page,
        };
        return {
            data,
            meta: pagination,
        };
    }

    static async isExisting(user_id: string, influencer_id: string) {
        const existing = await this.setTable().findFirst({
            where: {
                user_id,
                influencer_id,
            },
        });
        if (existing) {
            return existing;
        }
        return null;
    }

    static async getById(id: string) {
        return await this.setTable().findUnique({
            where: {
                id,
            },
            include: {
                user: true,
                influencer: true,
                last_message: true,
            },
        });
    }

    static async getAllByUserId(user_id: string) {
        return await this.setTable().findMany({
            where: {
                user_id,
            },
            include: {
                user: true,
                influencer: true,
                last_message: true,
            },
            orderBy: {
                updated_at: 'desc', // or 'desc' for descending
            },
        });
    }

    static async getByUserId(params: IPaginateParams, user_id: string) {
        const per_page = Number(params.per_page);
        const current_page = Number(params.current_page);
        const data = await this.setTable().findMany({
            take: per_page,
            skip: (per_page * (current_page - 1)) as number,
            where: {
                user_id,
            },
            include: {
                user: true,
                influencer: true,
                last_message: true,
            },
            orderBy: {
                updated_at: 'desc', // or 'desc' for descending
            },
        });

        const count = await this.setTable().count();
        const pages = Math.ceil(count / per_page);

        const pagination: IPagination = {
            total: count,
            last_page: pages,
            current_page: current_page,
            per_page: per_page,
            from: per_page * (current_page - 1) + 1,
            to: per_page * current_page,
        };
        return {
            data,
            meta: pagination,
        };
    }

    static async getBy(options: IChatroomQueryOptions) {
        const where = {};
        for (const key in options) {
            if (options[key]) {
                (where as any)[key] = { equals: options[key] };
            }
        }

        return await this.setTable().findMany({
            where,
            include: {
                user: true,
                influencer: true,
                last_message: true,
            },
        });
    }

    static async create(data: IChatroom) {
        return await this.setTable().create({
            data: data,
            include: {
                user: true,
                influencer: true,
                last_message: true,
            },
        });
    }

    static async bulKCreate(data: Array<IChatroom>) {
        const providers = data as IChatroom[];
        return await this.setTable().create({
            data: providers as any,
        });
    }

    static async update(id: string, entityModel: IChatroom) {
        return await this.setTable().update({
            where: {
                id,
            },
            include: {
                user: true,
                influencer: true,
                last_message: true,
            },
            data: entityModel,
        });
    }

    static async delete(id: string) {
        return await this.setTable().delete({
            where: {
                id,
            },
            include: {
                user: true,
                influencer: true,
                last_message: true,
            },
        });
    }

    static async bulKDelete(ids: string[]) {
        return await this.setTable().deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }
}
