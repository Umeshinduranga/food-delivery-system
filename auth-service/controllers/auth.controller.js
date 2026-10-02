const authService = require('../services/auth.service');

function sendError(response, error) {
  return response.status(error.statusCode || 500).json({
    error: error.statusCode ? error.message : 'Internal server error',
  });
}

async function register(request, response) {
  try {
    return response.status(201).json(await authService.register(request.body));
  } catch (error) {
    return sendError(response, error);
  }
}

async function login(request, response) {
  try {
    return response.json(await authService.login(request.body));
  } catch (error) {
    return sendError(response, error);
  }
}

function me(request, response) {
  try {
    return response.json({ user: authService.getUserById(request.user.id) });
  } catch (error) {
    return sendError(response, error);
  }
}

function updateStatus(request, response) {
  try {
    const user = authService.changeStatus(request.params.id, request.body.status);
    return response.json({ user });
  } catch (error) {
    return sendError(response, error);
  }
}

module.exports = { login, me, register, updateStatus };
