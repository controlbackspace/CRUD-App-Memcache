// C:\Users\jakea\Basic_CRUD_Application\backend\src\middleware\auth.js
const jwt = require('jsonwebtoken'); // EXISTING: Imports JWT library

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: "Access token required. Please login to get a token." 
    });
  }

  const secretKey = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key';

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: "Invalid token. Please provide a valid token." 
      });
    }

    req.user = user; 
    next(); 
  });
}

module.exports = authenticateToken;