exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('subscription_config');
  if (exists) {
    return;
  }

  await knex.schema.createTable('subscription_config', function (table) {
    // Un registro por cliente (user_id = usuario.id).
    table.integer('user_id').primary();
    // Monto mensual del servicio (lista de precios por cliente).
    table.decimal('amount', 12, 2).notNullable().defaultTo(0);
    table.boolean('active').notNullable().defaultTo(true);
    // Reservado para el cobro recurrente con tarjeta (Wompi) - fase 2.
    table.string('card_token').nullable();
    table.string('card_last4').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('subscription_config');
};
