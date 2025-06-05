const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// DB connection on startup
pool.query('SELECT NOW()')
    .then(res => console.log('Successfully connected to PostgreSQL at:', res.rows[0].now))
    .catch(err => console.error('Error connecting to the database', err.stack));

module.exports = pool;