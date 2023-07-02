import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('chatrooms').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('chatrooms', (table) => {
                table.string('id').primary().unique();
                table
                    .string('user_id')
                    .unsigned()
                    .references('users.id')
                    .onUpdate('CASCADE')
                    .onDelete('CASCADE');
                table
                    .string('influencer_id')
                    .unsigned()
                    .references('influencers.id')
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
    await knex.schema.dropTable('chatrooms');
}
