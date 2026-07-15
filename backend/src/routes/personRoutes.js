// C:\Users\jakea\Basic_CRUD_Application\backend\src\routes\personRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // EXISTING: Auth gatekeeper

module.exports = (personController) => {
  // Guard Check: Throw explicit developer errors instead of letting Express throw cryptic backtraces
  if (!personController) {
    throw new Error("personRoutes factory requires a valid personController instance.");
  }

  // FIX: Explicit safety guards to locate the exact undefined method causing your 'TypeError' crash
  const routes = [
    { path: 'GET /api/persons', handler: personController.getAll },
    { path: 'GET /api/persons/:id', handler: personController.getById },
    { path: 'POST /api/persons', handler: personController.create },
    { path: 'PUT /api/persons/:id', handler: personController.update },
    { path: 'DELETE /api/persons/:id', handler: personController.deletePerson }
  ];

  routes.forEach(route => {
    if (!route.handler) {
      throw new TypeError(`Router initialization failed: Callback handler for "${route.path}" is undefined. Check personController export properties.`);
    }
  });
  // ^^^ FIX: Intercepts undefined bindings before they hit node_modules/router/index.js:151

  router.get('/', authenticateToken, personController.getAll); // EXISTING
  router.get('/:id', authenticateToken, personController.getById); // EXISTING
  router.post('/', authenticateToken, personController.create); // EXISTING
  router.put('/:id', authenticateToken, personController.update); // EXISTING
  router.delete('/:id', authenticateToken, personController.deletePerson); // FIX: Pointed to clean renamed method

  return router;
};