import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('users').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('users', (table) => {
                table.string('id').primary().unique();
                table.string('username');
                table.string('full_name');
                table.string('email').unique();
                table.string('password').notNullable();
                table.string('contact_number').defaultTo('');
                table.integer('age').defaultTo(1);
                table.string('gender').defaultTo('male');
                table.text('avatar');
                table.text('remarks');
                table
                    .string('role_id')
                    .unsigned()
                    .references('roles.id')
                    .onUpdate('CASCADE')
                    .onDelete('CASCADE');
                table
                    .string('country_id')
                    .unsigned()
                    .references('countries.id')
                    .onUpdate('CASCADE')
                    .onDelete('CASCADE');
                table
                    .string('membership_id')
                    .unsigned()
                    .references('memberships.id')
                    .onUpdate('CASCADE')
                    .onDelete('CASCADE');
                table
                    .string('provider_id')
                    .unsigned()
                    .references('providers.id')
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
    await knex.schema.dropTable('users');
}
