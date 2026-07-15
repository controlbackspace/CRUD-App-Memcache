// C:\Users\jakea\Basic_CRUD_Application\backend\src\models\User.js
const dbConnection = require('../config/db'); 
const cache = require('../config/cache');

// Safe SQLite3 instance resolution
const db = dbConnection.db ? dbConnection.db : dbConnection;

const User = {
  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE username = ?`;
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  create: (username, hashedPassword) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
      db.run(sql, [username, hashedPassword], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this ? this.lastID : null, username });
        }
      });
    });
  }
};

module.exports = User;