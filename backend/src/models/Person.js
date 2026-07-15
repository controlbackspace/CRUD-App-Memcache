// C:\Users\jakea\Basic_CRUD_Application\backend\src\models\Person.js
const db = require('../config/db'); // FIX: Step up and reference your clean database configuration!

function calculateAge(dobString) {
  if (!dobString) return 0;
  const birthDate = new Date(dobString);
  const today = new Date();
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }
  return calculatedAge < 0 ? 0 : calculatedAge;
}

const Person = {
  // Create a new record bound to the authenticated user ID
  create: (personData, userId) => {
    return new Promise((resolve, reject) => {
      const { firstname, lastname, dob, sex } = personData;
      const sql = `
        INSERT INTO persons (firstname, lastname, dob, sex, user_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(sql, [firstname, lastname, dob, sex, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ 
            id: this.lastID, 
            firstname, 
            lastname, 
            dob, 
            sex, 
            age: calculateAge(dob), 
            user_id: userId 
          });
        }
      });
    });
  },
  findById: (id, userId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM persons WHERE id = ? AND user_id = ?`;
      db.get(sql, [id, userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? { ...row, age: calculateAge(row.dob) } : null);
        }
      });
    });
  },
  findAllByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM persons WHERE user_id = ?`;
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const mappedRows = rows.map(row => ({
            ...row,
            age: calculateAge(row.dob) 
          }));
          resolve(mappedRows);
        }
      });
    });
  },

  // Update an existing record verifying ownership bounds
  update: (id, personData, userId) => {
    return new Promise((resolve, reject) => {
      const { firstname, lastname, dob, sex } = personData;
      const sql = `
        UPDATE persons 
        SET firstname = ?, lastname = ?, dob = ?, sex = ?
        WHERE id = ? AND user_id = ?
      `;
      db.run(sql, [firstname, lastname, dob, sex, id, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  // Delete a record safely
  delete: (id, userId) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM persons WHERE id = ? AND user_id = ?`;
      
      // FIX: Use a standard function callback so 'this' binds to the SQLite statement context
      db.run(sql, [id, userId], function(err) {
        if (err) {
          console.error("❌ SQLite error during delete query execution:", err.message);
          reject(err);
        } else {
          // Debug logs so we can see what physical action occurred:
          console.log(`[Database] Attempted DELETE on ID: ${id} by User: ${userId}. Rows affected: ${this.changes}`);
          
          // FIX: Explicitly pass back the changes captured from 'this' statement context
          resolve({ changes: this.changes });
        }
      });
    });
  }
};

module.exports = Person;