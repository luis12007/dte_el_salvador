exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('service_payments');
  if (!exists) {
    await knex.schema.createTable('service_payments', function (table) {
      table.increments('id').primary();
      table.integer('user_id').notNullable().index();
      // Periodo que cubre el pago, formato 'YYYY-MM' (siempre vence el 15).
      table.string('period').notNullable();
      // pending | confirmed | rejected
      table.string('status').notNullable().defaultTo('pending');
      // card | transfer
      table.string('method').nullable();
      table.decimal('amount', 12, 2).nullable();
      table.string('reference').nullable();
      // Comprobante de transferencia (dataURL base64 de imagen o PDF).
      table.text('proof').nullable();
      table.string('proof_mime').nullable();
      table.string('proof_name').nullable();
      table.text('note').nullable();
      table.integer('reviewed_by').nullable();
      table.timestamp('confirmed_at').nullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      table.index(['user_id', 'period']);
    });
    return;
  }

  // La tabla ya existe: agregar columnas faltantes de forma idempotente.
  const columns = ['proof_mime', 'proof_name', 'note'];
  for (const column of columns) {
    const hasColumn = await knex.schema.hasColumn('service_payments', column);
    if (!hasColumn) {
      await knex.schema.alterTable('service_payments', (table) => {
        if (column === 'note') {
          table.text('note').nullable();
        } else {
          table.string(column).nullable();
        }
      });
    }
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('service_payments');
};
