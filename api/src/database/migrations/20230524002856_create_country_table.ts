import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('countries').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('countries', (table) => {
                table.string('id').primary().unique();
                table.string('name').notNullable();
                table.string('code').notNullable();
                table.string('timezone').notNullable();
                table
                    .string('currency_id')
                    .unsigned()
                    .references('currencies.id')
                    .onUpdate('CASCADE')
                    .onDelete('CASCADE');
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
    await knex.schema.dropTable('countries');
}
