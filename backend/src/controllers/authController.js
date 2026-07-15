// C:\Users\jakea\Basic_CRUD_Application\backend\src\controllers\authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (UserModel) => {
  return {
    // 1. REGISTER NEW USER
    register: async (req, res) => {
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Check if user already exists
        const existingUser = await UserModel.findByUsername(username);
        if (existingUser) {
          return res.status(400).json({ error: 'Username is already taken.' });
        }

        // Hash password and save to database
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create(username, hashedPassword);

        res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
      } catch (err) {
        console.error('❌ Registration Error:', err.message);
        res.status(500).json({ error: 'Internal server registration failure.' });
      }
    },

    // 2. LOGIN USER
    login: async (req, res) => {
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required.' });
        }

        const user = await UserModel.findByUsername(username);
        if (!user) {
          return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Verify password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Generate security token
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET || 'fallback_secret_key',
          { expiresIn: '1h' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: { id: user.id, username: user.username }
        });
      } catch (err) {
        console.error('❌ Login Error:', err.message);
        res.status(500).json({ error: 'Internal server login failure.' });
      }
    }
  };
};