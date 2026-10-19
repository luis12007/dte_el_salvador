// Distrito del emisor (CAT-008), requerido en la dirección de los DTE con los
// esquemas vigentes del MH. Si queda vacío, los DTE usan la dirección por
// defecto San Salvador / San Salvador Centro / San Salvador (06/23/14).
exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn('emisor', 'distrito');
  if (hasColumn) {
    return;
  }

  await knex.schema.alterTable('emisor', function (table) {
    table.string('distrito', 2).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('emisor', function (table) {
    table.dropColumn('distrito');
  });
};
