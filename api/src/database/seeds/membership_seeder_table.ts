import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('memberships').del();

    // Inserts seed entries
    await knex('memberships').insert([
        {
            id: 'free',
            name: 'Free Acount',
        },
        {
            id: 'paid',
            name: 'Paid Account',
        },
        {
            id: 'gold',
            name: 'Gold Account',
        },
    ]);
}
