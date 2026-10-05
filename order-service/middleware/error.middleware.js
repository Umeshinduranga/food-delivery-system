function errorHandler(error, response) {
  const statusCode = error.statusCode || 500;
  response.statusCode = statusCode;
  response.end(JSON.stringify({ error: error.message || 'Internal server error' }));
}

module.exports = { errorHandler };