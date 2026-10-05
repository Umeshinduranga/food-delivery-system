function serviceError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sendError(response, error) {
  return response.status(error.statusCode || 500).json({
    error: error.statusCode ? error.message : 'Internal server error',
  });
}

module.exports = { sendError, serviceError };
