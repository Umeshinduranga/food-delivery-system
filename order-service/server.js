const http = require('node:http');
const { port, serviceName, deliveryFee } = require('./config/order.config');
const OrderRepository = require('./repositories/order.repository');
const { OrderService } = require('./services/order.service');
const OrderController = require('./controllers/order.controller');
const { createOrderRoutes } = require('./routes/order.routes');
const { AppError } = require('./utils/errors');
const { errorHandler } = require('./middleware/error.middleware');

const orderService = new OrderService(new OrderRepository(), deliveryFee);
const orderController = new OrderController(orderService);
const routes = createOrderRoutes(orderController);

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch { reject(new AppError(400, 'Request body must be valid JSON')); }
    });
    request.on('error', reject);
  });
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (request.method === 'GET' && url.pathname === '/health') {
      return sendJson(response, 200, { service: serviceName, status: 'ok' });
    }

    const route = routes.find((candidate) => candidate.method === request.method && candidate.pattern.test(url.pathname));
    if (!route) return sendJson(response, 404, { error: 'Route not found' });

    const body = request.method === 'POST' || request.method === 'PATCH' ? await readBody(request) : {};
    const result = await route.handler({ body, params: {} }, url.pathname.match(route.pattern));
    return sendJson(response, request.method === 'POST' && url.pathname === '/orders' ? 201 : 200, result);
  } catch (error) {
    response.setHeader('Content-Type', 'application/json');
    errorHandler(error, response);
  }
});

server.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});

module.exports = server;
