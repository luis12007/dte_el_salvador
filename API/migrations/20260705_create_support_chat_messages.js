exports.up = function (knex) {
  return knex.schema.createTable('support_chat_messages', function (table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable().index();
    table.integer('sender_id').notNullable();
    table.string('sender_name').notNullable();
    table.string('sender_role').notNullable();
    table.text('message').notNullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.index(['user_id', 'created_at']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('support_chat_messages');
};