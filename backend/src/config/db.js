// C:\Users\jakea\Basic_CRUD_Application\backend\src\config\db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to open SQLite3 database file:', err.message);
  } else {
    console.log('✔ Successfully connected to the physical SQLite3 database file.');
    
    // Create tables if they do not exist to prevent schema mismatches
    db.serialize(() => {
      // 1. Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `, (tableErr) => {
        if (tableErr) console.error("❌ Error initializing 'users' table:", tableErr.message);
      });

      // 2. Create persons table bound to users
      db.run(`
        CREATE TABLE IF NOT EXISTS persons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          firstname TEXT NOT NULL,
          lastname TEXT NOT NULL,
          dob TEXT NOT NULL,
          sex TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `, (tableErr) => {
        if (tableErr) console.error("❌ Error initializing 'persons' table:", tableErr.message);
      });
    });
  }
});

module.exports = db;