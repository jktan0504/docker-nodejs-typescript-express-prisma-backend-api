import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('roles').del();

    // Inserts seed entries
    await knex('roles').insert([
        {
            id: 'Superadmin',
            name: 'Superadmin',
        },
        {
            id: 'Admin',
            name: 'Admin',
        },
        {
            id: 'User',
            name: 'User',
        },
        {
            id: 'Influencer',
            name: 'Influencer',
        },
    ]);
}
