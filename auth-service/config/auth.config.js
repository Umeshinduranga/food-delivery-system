const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET must be configured');
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
  );
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { createToken, verifyToken };
