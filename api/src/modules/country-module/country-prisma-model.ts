import {
    IPaginateParams,
    IPagination,
    ICountry,
    ICountryQueryOptions,
} from '../common/interfaces';
import db from '../common/prisma.module';

export class Country {
    static setTable() {
        return db.country;
    }

    static async getAll() {
        const data = await this.setTable().findMany({
            include: {
                currency: true,
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
                currency: true,
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
                currency: true,
            },
        });
    }

    static async getBy(options: ICountryQueryOptions) {
        const where = {};
        for (const key in options) {
            if (options[key]) {
                (where as any)[key] = { equals: options[key] };
            }
        }

        return await this.setTable().findMany({
            where,
            include: {
                currency: true,
            },
        });
    }

    static async create(data: ICountry) {
        return await this.setTable().create({
            data: data,
        });
    }

    static async bulKCreate(data: Array<ICountry>) {
        const providers = data as ICountry[];
        return await this.setTable().create({
            data: providers as any,
        });
    }

    static async update(id: string, entityModel: ICountry) {
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
