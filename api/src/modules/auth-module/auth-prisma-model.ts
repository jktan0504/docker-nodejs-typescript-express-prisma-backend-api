import {
    IPaginateParams,
    IPagination,
    IUser,
    IUserQueryOptions,
} from '../common/interfaces';
import db from '../common/prisma.module';

export class Auth {
    static setTable() {
        return db.user;
    }

    static async getAll() {
        const data = await this.setTable().findMany({
            select: {
                id: true,
                username: true,
                full_name: true,
                email: true,
                password: false,
                contact_number: true,
                gender: true,
                age: true,
                remarks: true,
                avatar: true,
                role_id: true,
                country_id: true,
                membership_id: true,
                provider_id: true,
                activated: true,
                created_at: true,
                created_by: true,
                updated_at: true,
                updated_by: true,
                role: true,
                country: true,
                membership: true,
                provider: true,
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
            select: {
                id: true,
                username: true,
                full_name: true,
                email: true,
                password: false,
                contact_number: true,
                gender: true,
                age: true,
                remarks: true,
                avatar: true,
                role_id: true,
                country_id: true,
                membership_id: true,
                provider_id: true,
                activated: true,
                created_at: true,
                created_by: true,
                updated_at: true,
                updated_by: true,
                role: true,
                country: true,
                membership: true,
                provider: true,
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
            select: {
                id: true,
                username: true,
                full_name: true,
                email: true,
                password: false,
                contact_number: true,
                gender: true,
                age: true,
                remarks: true,
                avatar: true,
                role_id: true,
                country_id: true,
                membership_id: true,
                provider_id: true,
                activated: true,
                created_at: true,
                created_by: true,
                updated_at: true,
                updated_by: true,
                role: true,
                country: true,
                membership: true,
                provider: true,
            },
        });
    }

    static async getBy(options: IUserQueryOptions) {
        const where = {};
        for (const key in options) {
            if (options[key]) {
                (where as any)[key] = { equals: options[key] };
            }
        }

        return await this.setTable().findMany({
            where,
            select: {
                id: true,
                username: true,
                full_name: true,
                email: true,
                password: false,
                contact_number: true,
                gender: true,
                age: true,
                remarks: true,
                avatar: true,
                role_id: true,
                country_id: true,
                membership_id: true,
                provider_id: true,
                activated: true,
                created_at: true,
                created_by: true,
                updated_at: true,
                updated_by: true,
                role: true,
                country: true,
                membership: true,
                provider: true,
            },
        });
    }

    static async create(data: IUser) {
        return await this.setTable().create({
            data: data,
        });
    }

    static async bulKCreate(data: Array<IUser>) {
        const providers = data as IUser[];
        return await this.setTable().create({
            data: providers as any,
        });
    }

    static async update(id: string, entityModel: IUser) {
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
