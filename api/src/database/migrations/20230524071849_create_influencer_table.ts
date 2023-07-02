import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('influencers').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('influencers', (table) => {
                table.string('id').primary().unique();
                table.string('username');
                table.string('full_name');
                table.text('bio');
                table.integer('num_of_followers').defaultTo(0);
                table.text('avatar');
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
    await knex.schema.dropTable('influencers');
}
