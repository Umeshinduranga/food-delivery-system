const { verifyToken } = require('../config/auth.config');
const userRepository = require('../repositories/user.repository');

function authenticate(request, response, next) {
  const authorization = request.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ error: 'Bearer token is required' });
  }

  try {
    const payload = verifyToken(token);
    const user = userRepository.findById(payload.sub);
    if (!user || user.status !== 'ACTIVE') {
      return response.status(401).json({ error: 'User is not authorized' });
    }

    request.user = user;
    return next();
  } catch (error) {
    return response.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticate };
