import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('memberships').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('memberships', (table) => {
                table.string('id').primary().unique();
                table.string('name').notNullable().unique();
                table.text('description');
                table.double('price').defaultTo(0);
                table.boolean('activated').defaultTo(true);
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
    await knex.schema.dropTable('memberships');
}
