import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.hasTable('chatrooms').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('chatrooms', (table) => {
                table
                    .string('last_message_id')
                    .unsigned()
                    .references('chat_messages.id')
                    .onUpdate('CASCADE')
                    .onDelete('CASCADE')
                    .after('influencer_id');
            });
        }
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('chatrooms');
}
