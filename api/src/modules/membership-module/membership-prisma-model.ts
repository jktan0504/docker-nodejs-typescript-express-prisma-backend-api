import {
    IPaginateParams,
    IPagination,
    IMembership,
    IMembershipQueryOptions,
} from '../common/interfaces';
import db from '../common/prisma.module';

export class Membership {
    static setTable() {
        return db.membership;
    }

    static async getAll() {
        const data = await this.setTable().findMany({});
        return data;
    }

    static async getAllPaginate(params: IPaginateParams) {
        const per_page = Number(params.per_page);
        const current_page = Number(params.current_page);
        const data = await this.setTable().findMany({
            take: per_page,
            skip: (per_page * (current_page - 1)) as number,
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
        });
    }

    static async getBy(options: IMembershipQueryOptions) {
        const where = {};
        for (const key in options) {
            if (options[key]) {
                (where as any)[key] = { equals: options[key] };
            }
        }

        return await this.setTable().findMany({
            where,
        });
    }

    static async create(data: IMembership) {
        return await this.setTable().create({
            data: data,
        });
    }

    static async bulKCreate(data: Array<IMembership>) {
        const providers = data as IMembership[];
        return await this.setTable().create({
            data: providers as any,
        });
    }

    static async update(id: string, entityModel: IMembership) {
        return await this.setTable().update({
            where: {
                id,
            },
            data: entityModel,
        });
    }

    static async delete(id: string) {
        return await this.setTable().delete({
            where: {
                id,
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
