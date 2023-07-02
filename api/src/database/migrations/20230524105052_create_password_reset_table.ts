import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('password_resets').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('password_resets', (table) => {
                table.increments('id').primary().unique();
                table.string('email').notNullable();
                table.string('token').notNullable();
                table
                    .timestamp('created_at')
                    .defaultTo(knex.fn.now())
                    .notNullable();
                table
                    .timestamp('updated_at')
                    .defaultTo(knex.fn.now())
                    .nullable();
                table.string('created_by').nullable();
                table.string('updated_by').nullable();
            });
        }
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('password_resets');
}
