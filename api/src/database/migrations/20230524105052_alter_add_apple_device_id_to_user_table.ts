import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('users').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('users', (table) => {
                table.string('apple_device_id').unique().after('remarks');
            });
        }
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}
