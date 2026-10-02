const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.patch(
  '/users/:id/status',
  authenticate,
  requireRole('ADMIN'),
  authController.updateStatus,
);

module.exports = router;
