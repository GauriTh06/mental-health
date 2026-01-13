const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

let db;
const isPostgres = !!process.env.DATABASE_URL;

if (isPostgres) {
    db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    console.log("Connected to PostgreSQL (Neon/Cloud)");
} else if (process.env.NODE_ENV === 'production') {
    throw new Error("CRITICAL ERROR: DATABASE_URL is missing in production. Cannot use SQLite.");
} else {
    const dbPath = path.resolve(__dirname, 'database.sqlite');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) console.error('Error opening database: ' + err.message);
        else console.log('Connected to SQLite (Local)');
    });
}

// Unified Query Interface
const run = (query, params, callback) => {
    if (isPostgres) {
        // Convert ? to $1, $2, etc. for Postgres
        let i = 1;
        const pgQuery = query.replace(/\?/g, () => `$${i++}`);

        db.query(pgQuery, params, (err, res) => {
            // Callback simulation: function(err) with 'this' context having lastID
            // Note: Postgres INSERT RETURNING id is needed to get lastID efficiently
            // For now, simple error handling.
            if (callback) {
                // Mocking 'this' context for lastID is tricky without rewriting queries to use RETURNING
                // We will handle specific 'INSERT' queries in server.js or modify here if needed.
                // This is a basic adapter.
                callback.call({ lastID: res?.rows[0]?.id }, err);
            }
        });
    } else {
        db.run(query, params, callback);
    }
};

const get = (query, params, callback) => {
    if (isPostgres) {
        let i = 1;
        const pgQuery = query.replace(/\?/g, () => `$${i++}`);
        db.query(pgQuery, params, (err, res) => {
            callback(err, res ? res.rows[0] : null);
        });
    } else {
        db.get(query, params, callback);
    }
};

const all = (query, params, callback) => {
    if (isPostgres) {
        let i = 1;
        const pgQuery = query.replace(/\?/g, () => `$${i++}`);
        db.query(pgQuery, params, (err, res) => {
            callback(err, res ? res.rows : []);
        });
    } else {
        db.all(query, params, callback);
    }
};

// Initialize Tables
if (isPostgres) {
    // Postgres Init
    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            occupation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS assessments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            round1_score INTEGER,
            round2_score INTEGER,
            answers TEXT,
            analysis TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            content TEXT NOT NULL,
            sender TEXT NOT NULL,
            context TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    ];
    queries.forEach(q => db.query(q));
} else {
    // SQLite Init
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            occupation TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            round1_score INTEGER,
            round2_score INTEGER,
            answers TEXT,
            analysis TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            sender TEXT NOT NULL, 
            context TEXT, 
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);
    });
}

module.exports = { run, get, all };
