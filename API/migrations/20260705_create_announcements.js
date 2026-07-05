exports.up = async function (knex) {
  await knex.schema.createTable('announcements', function (table) {
    table.increments('id').primary();
    table.text('message').notNullable().defaultTo('');
    table.boolean('enabled').notNullable().defaultTo(false);
    table.integer('version').notNullable().defaultTo(1);
    table.integer('updated_by').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  // Ensure a single config row exists (id = 1).
  const existing = await knex('announcements').where({ id: 1 }).first();
  if (!existing) {
    await knex('announcements').insert({
      id: 1,
      message: '',
      enabled: false,
      version: 1,
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('announcements');
};
