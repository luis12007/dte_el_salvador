exports.up = async (knex) => {
  // Mark all payments with period up to and including 2026-06 as confirmed
  await knex('service_payments')
    .where('period', '<=', '2026-06')
    .update({
      status: 'confirmed',
      confirmed_at: knex.raw('COALESCE(confirmed_at, NOW())'),
      updated_at: knex.raw('NOW()'),
    });
};

exports.down = async (knex) => {
  // This migration sets historical data, so rollback is not needed
  // but keeping the function for consistency
};
