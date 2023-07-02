import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('currencies').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('currencies', (table) => {
                table.string('id').primary().unique();
                table.string('name').unique().notNullable();
                table.string('code').notNullable();
                table.string('symbol').notNullable();
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
    await knex.schema.dropTable('currencies');
}
