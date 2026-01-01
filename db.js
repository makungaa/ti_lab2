const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'lab2.db');
const INIT_SQL = path.join(__dirname, 'db', 'init.sql');

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('DB open error:', err.message);
        return;
    }

    console.log('SQLite connected');

    // jeśli baza jest pusta, to stworz z pliku init.sql
    db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Members'",
        (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }

            if (!row) {
                console.log('Initializing database...');
                const sql = fs.readFileSync(INIT_SQL, 'utf8');
                db.exec(sql, (err) => {
                    if (err) console.error('Init error:', err.message);
                    else console.log('Database initialized');
                });
            }
        }
    );
});

db.run('PRAGMA foreign_keys = ON');

module.exports = db;
