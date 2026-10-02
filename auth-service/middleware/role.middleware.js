function requireRole(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ error: 'Insufficient permissions' });
    }

    return next();
  };
}

module.exports = { requireRole };
