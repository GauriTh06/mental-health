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
} else {
    if (process.env.NODE_ENV === 'production') {
        console.warn("⚠️  WARNING: DATABASE_URL is missing. Falling back to SQLite.");
        console.warn("⚠️  Data will be local/ephemeral. Set DATABASE_URL for persistent Neon DB.");
    }
    const dbPath = path.resolve(__dirname, 'database.sqlite');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) console.error('Error opening database: ' + err.message);
        else console.log('Connected to SQLite (Local/Fallback)');
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

// Initialize Tables with Extended Profile Fields
const userTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id ${isPostgres ? 'SERIAL' : 'INTEGER'} PRIMARY KEY ${isPostgres ? '' : 'AUTOINCREMENT'},
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        age INTEGER,
        gender TEXT,
        occupation TEXT,
        bio TEXT,
        wellness_goals TEXT,
        emergency_contact TEXT,
        language TEXT,
        location TEXT,
        blood_group TEXT,
        created_at ${isPostgres ? 'TIMESTAMP' : 'DATETIME'} DEFAULT CURRENT_TIMESTAMP
    );
`;

const migrationQueries = [
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS wellness_goals TEXT;`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact TEXT;`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS language TEXT;`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS blood_group TEXT;`
];

if (isPostgres) {
    db.query(userTableQuery);
    // Postgres migration (ignoring errors if columns exist)
    migrationQueries.forEach(q => db.query(q).catch(() => { }));

    db.query(`CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        round1_score INTEGER,
        round2_score INTEGER,
        answers TEXT,
        analysis TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    db.query(`CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        sender TEXT NOT NULL,
        context TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
} else {
    db.serialize(() => {
        db.run(userTableQuery);
        // SQLite migration (ignoring errors if columns exist)
        migrationQueries.forEach(q => db.run(q, [], () => { }));

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
