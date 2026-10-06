function errorHandler(error, response) {
  response.statusCode = error.statusCode || 500;
  response.end(JSON.stringify({ error: error.message || 'Internal server error' }));
}

module.exports = { errorHandler };