import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('providers').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('providers', (table) => {
                table.string('id').primary().unique();
                // table.specificType('id', 'CHAR(16)').primary().unique();
                table.string('name').unique().notNullable();
                table.string('description').nullable();
                table.string('key').nullable();
                table.string('secret_key').nullable();
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
    await knex.schema.dropTable('providers');
}
