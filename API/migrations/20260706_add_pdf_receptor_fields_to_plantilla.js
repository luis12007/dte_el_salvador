/**
 * Campos de NRC y actividad económica del receptor SOLO para el PDF de la
 * Factura de Consumidor Final (tipo 01).
 *
 * IMPORTANTE: se guardan en columnas propias (pdf_*) y NO en re_nrc /
 * re_codactividad / re_actividad_economica, porque esas últimas se usan para
 * reconstruir el JSON que se firma y se envía al Ministerio de Hacienda.
 * Mantenerlas separadas garantiza que estos datos aparezcan únicamente en el
 * PDF y no alteren el documento transmitido.
 */
exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable('plantilla');
  if (!hasTable) {
    return;
  }

  const [hasNrc, hasCod, hasAct] = await Promise.all([
    knex.schema.hasColumn('plantilla', 'pdf_nrc'),
    knex.schema.hasColumn('plantilla', 'pdf_cod_actividad'),
    knex.schema.hasColumn('plantilla', 'pdf_actividad_economica'),
  ]);

  await knex.schema.alterTable('plantilla', function (table) {
    if (!hasNrc) table.string('pdf_nrc').nullable();
    if (!hasCod) table.string('pdf_cod_actividad').nullable();
    if (!hasAct) table.string('pdf_actividad_economica').nullable();
  });
};

exports.down = async function (knex) {
  const hasTable = await knex.schema.hasTable('plantilla');
  if (!hasTable) {
    return;
  }

  await knex.schema.alterTable('plantilla', function (table) {
    table.dropColumn('pdf_nrc');
    table.dropColumn('pdf_cod_actividad');
    table.dropColumn('pdf_actividad_economica');
  });
};
