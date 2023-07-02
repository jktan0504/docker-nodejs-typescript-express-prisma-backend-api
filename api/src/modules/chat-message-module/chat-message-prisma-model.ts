import {
    IPaginateParams,
    IPagination,
    IChatMessage,
    IChatMessageQueryOptions,
} from '../common/interfaces';
import db from '../common/prisma.module';

export class ChatMessage {
    static setTable() {
        return db.chatMessage;
    }

    static async getAll() {
        const data = await this.setTable().findMany({
            include: {
                user: true,
                influencer: true,
                chatroom: true,
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
                chatroom: true,
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

    static async getAllByChatRoomId(chatroom_id: string) {
        return await this.setTable().findMany({
            where: {
                chatroom_id,
            },
            include: {
                user: true,
                influencer: true,
                chatroom: true,
            },
            orderBy: {
                created_at: 'desc', // or 'desc' for descending
            },
        });
    }

    static async getAllByChatRoomIdForOpenAI(chatroom_id: string) {
        return await this.setTable().findMany({
            where: {
                chatroom_id,
            },
            include: {
                user: true,
                influencer: true,
                chatroom: true,
            },
            // take: 20,
            orderBy: {
                created_at: 'asc', // or 'desc' for descending
            },
        });
    }

    static async getByChatRoomId(params: IPaginateParams, chatroom_id: string) {
        const per_page = Number(params.per_page);
        const current_page = Number(params.current_page);
        const data = await this.setTable().findMany({
            take: per_page,
            skip: (per_page * (current_page - 1)) as number,
            where: {
                chatroom_id,
            },
            include: {
                user: true,
                influencer: true,
                chatroom: true,
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

    static async getById(id: string) {
        return await this.setTable().findUnique({
            where: {
                id,
            },
            include: {
                user: true,
                influencer: true,
                chatroom: true,
            },
        });
    }

    static async getBy(options: IChatMessageQueryOptions) {
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
                chatroom: true,
            },
        });
    }

    static async create(data: IChatMessage) {
        return await this.setTable().create({
            data: data,
            include: {
                user: true,
                influencer: true,
                chatroom: true,
            },
        });
    }

    static async bulKCreate(data: Array<IChatMessage>) {
        const providers = data as IChatMessage[];
        return await this.setTable().create({
            data: providers as any,
        });
    }

    static async update(id: string, entityModel: IChatMessage) {
        return await this.setTable().update({
            where: {
                id,
            },
            include: {
                user: true,
                influencer: true,
                chatroom: true,
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
                chatroom: true,
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
