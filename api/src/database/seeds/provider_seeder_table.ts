import { Knex } from 'knex';
import { genId } from '../../modules/common/prisma.module';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('providers').del();

    // Inserts seed entries
    await knex('providers').insert([
        {
            id: 'Google',
            name: 'Google',
            description: 'Google social login',
        },
        {
            id: 'Apple',
            name: 'Apple',
            description: 'Apple social login',
        },
    ]);
}
