const knex = require('knex');
const db = knex({
    client: 'postgresql',
    connection: {
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:b1EDCe*5DeaC32GCDe43CE2e3g5acFCc@monorail.proxy.rlwy.net:16350/railway',
        ssl: {
            rejectUnauthorized: false,
            ca: process.env.SSL_CERT_DAYS,
        },
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
    },
    seeds: {
        directory: './seeds',
    },
});

module.exports = db;