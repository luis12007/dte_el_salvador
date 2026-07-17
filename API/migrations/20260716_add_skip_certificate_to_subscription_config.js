exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn('subscription_config', 'skip_certificate_validation');
  if (hasColumn) {
    return;
  }

  await knex.schema.alterTable('subscription_config', function (table) {
    table.boolean('skip_certificate_validation').notNullable().defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('subscription_config', function (table) {
    table.dropColumn('skip_certificate_validation');
  });
};
