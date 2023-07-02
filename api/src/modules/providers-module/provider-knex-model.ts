import {
    IPaginateParams,
    IProvider,
    IProviderQueryOptions,
} from '../common/interfaces';
import { KnexModel } from '../common/knex.module';
import { DataBaseTables } from '../common/enums';

export class Provider {
    static setTable(): string {
        return DataBaseTables.PROVIDERS_TABLE as string;
    }

    static async create(data: IProvider) {
        return await KnexModel.create(this.setTable(), data);
    }

    static async bulKCreate(data: Array<IProvider>) {
        return await KnexModel.bulKCreate(this.setTable(), data);
    }

    static async delete(entityId: string) {
        return await KnexModel.delete(this.setTable(), entityId);
    }

    static async bulKDelete(data: Array<IProvider>) {
        return await KnexModel.bulKDelete(this.setTable(), data);
    }

    static async getAll() {
        return await KnexModel.getAll(this.setTable());
    }

    static async getAllPaginate(params: IPaginateParams) {
        return await KnexModel.getAllPaginate(this.setTable(), params);
    }

    static async getById(entityId: string) {
        return await KnexModel.getById(this.setTable(), entityId);
    }

    static async getBy(options: IProviderQueryOptions) {
        return await KnexModel.getBy(this.setTable(), options);
    }

    static async update(entityId: string, entityModel: IProvider) {
        return await KnexModel.update(this.setTable(), entityId, entityModel);
    }
}
