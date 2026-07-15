const express = require('express');
const router = express.Router();

module.exports = (authController) => {
  // Map endpoint paths to distinct template orchestrator methods
  router.post('/register', authController.register);
  router.post('/login', authController.login);

  return router;
};