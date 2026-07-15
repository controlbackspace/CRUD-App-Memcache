// C:\Users\jakea\Basic_CRUD_Application\backend\server.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// 1. ATOMS LAYER: Infrastructure Connection Clients
const db = require('./src/config/db');
const cache = require('./src/config/cache');

// 2. MOLECULES LAYER: Dependency Injection into Data Models
const UserModel = require('./src/models/User'); 
const PersonModel = require('./src/models/Person'); 

// 3. TEMPLATES LAYER: Initializing Route Coordinators
const authController = require('./src/controllers/authController')(UserModel);
const personController = require('./src/controllers/personController')(PersonModel);

// 4. PAGES LAYER: Initializing Routers
const authRoutes = require('./src/routes/authRoutes')(authController);
const personRoutes = require('./src/routes/personRoutes')(personController);

const PORT = process.env.PORT || 5000;

// FIX: Move Global CORS registration to the VERY TOP of the middleware chain
app.use(cors({
  origin: '*', // Permits requests from any origin (e.g. your local web port)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // FIX: Handled successfully during browser preflights
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // EXISTING: Must also run before routes to parse JSON bodies

// 5. MOUNTING ROUTE ENTRY CHANNELS
app.use('/api/auth', authRoutes); // EXISTING: Mounted safely after global handlers
app.use('/api/persons', personRoutes); // EXISTING: Mounted safely after global handlers

// 6. GLOBAL CATCH-ALL FOR TRAPPED UNTRACKED PATHS
app.use((req, res) => {
  res.status(404).json({ error: "Resource endpoint route not found" });
});

// 7. SERVER INITIALIZATION LISTENER BOUNDARY
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(` ✔ Layered CRUD Application Backend Online!`);
  console.log(` ✔ Listening on local endpoint: http://localhost:${PORT}`);
  console.log(` ✔ Open to virtual emulators on gateway: http://10.0.2.2:${PORT}`);
  console.log(`======================================================\n`);
});

module.exports = { app, server };