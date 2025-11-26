// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

// Debug middleware
authRouter.use((req, res, next) => {
  console.log('Auth route hit:', req.method, req.url);
  console.log('Request body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

// These routes don't need authentication (public routes)
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);

module.exports = authRouter;