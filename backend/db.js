require("dotenv").config();

const { Pool } = require("pg");

// =====================================
// PostgreSQL Connection Pool
// =====================================

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),

    // Enable SSL only when required
    ssl:
        process.env.DB_SSL === "true"
            ? { rejectUnauthorized: false }
            : false,
});

// =====================================
// Test Database Connection
// =====================================

pool.connect()
    .then(client => {

        console.log("✅ PostgreSQL Connected Successfully!");

        client.release();

    })
    .catch(err => {

        console.error("❌ PostgreSQL Connection Error:");

        console.error(err.message);

    });

// =====================================
// Pool Error Listener
// =====================================

pool.on("error", (err) => {

    console.error("Unexpected PostgreSQL Pool Error:");

    console.error(err);

});

// =====================================

module.exports = pool;