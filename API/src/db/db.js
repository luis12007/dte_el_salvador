const knex = require('knex');
const db = knex({
    client: 'postgresql',
    connection: {
        host: process.env.PGHOST || 'monorail.proxy.rlwy.net',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'b1EDCe*5DeaC32GCDe43CE2e3g5acFCc',
        database: process.env.PGDATABASE || 'railway',
        port: process.env.PGPORT || 16350,
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