const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const { createToken } = require('../config/auth.config');
const {
  ACCOUNT_STATUSES,
  ROLES,
  toPublicUser,
} = require('../models/user.model');

function authError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function validateRegistrationInput({ name, email, password }) {
  if (typeof name !== 'string' || name.trim().length < 2) {
    throw authError('Name must contain at least 2 characters', 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw authError('A valid email is required', 400);
  }
  if (typeof password !== 'string' || password.length < 8) {
    throw authError('Password must contain at least 8 characters', 400);
  }
}

async function register({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  validateRegistrationInput({ name, email: normalizedEmail, password });

  if (userRepository.findByEmail(normalizedEmail)) {
    throw authError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = userRepository.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'CUSTOMER',
    status: 'ACTIVE',
  });

  return { user: toPublicUser(user), token: createToken(user) };
}

async function login({ email, password }) {
  const user = userRepository.findByEmail(normalizeEmail(email));
  const passwordMatches = user && typeof password === 'string'
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    throw authError('Invalid email or password', 401);
  }
  if (user.status !== 'ACTIVE') {
    throw authError('Account is inactive', 403);
  }

  return { user: toPublicUser(user), token: createToken(user) };
}

function getUserById(id) {
  const user = userRepository.findById(id);
  if (!user) {
    throw authError('User not found', 404);
  }
  return toPublicUser(user);
}

function changeStatus(id, status) {
  if (!ACCOUNT_STATUSES.includes(status)) {
    throw authError(`Status must be one of: ${ACCOUNT_STATUSES.join(', ')}`, 400);
  }

  const user = userRepository.updateStatus(id, status);
  if (!user) {
    throw authError('User not found', 404);
  }
  return toPublicUser(user);
}

function isSupportedRole(role) {
  return ROLES.includes(role);
}

module.exports = {
  changeStatus,
  getUserById,
  isSupportedRole,
  login,
  register,
};
