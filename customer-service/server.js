const http = require('node:http');
const { port, serviceName } = require('./config/customer.config');
const CustomerRepository = require('./repositories/customer.repository');
const AddressRepository = require('./repositories/address.repository');
const { CustomerService } = require('./services/customer.service');
const { AddressService } = require('./services/address.service');
const CustomerController = require('./controllers/customer.controller');
const AddressController = require('./controllers/address.controller');
const { createCustomerRoutes } = require('./routes/customer.routes');
const { createAddressRoutes } = require('./routes/address.routes');
const { AppError } = require('./utils/errors');
const { errorHandler } = require('./middleware/error.middleware');

const customerRepository = new CustomerRepository();
const addressRepository = new AddressRepository();
const customerService = new CustomerService(customerRepository, addressRepository);
const addressService = new AddressService(addressRepository, customerRepository);
const routes = [
  ...createCustomerRoutes(new CustomerController(customerService)),
  ...createAddressRoutes(new AddressController(addressService))
];

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
    if (request.method === 'GET' && url.pathname === '/health') return sendJson(response, 200, { service: serviceName, status: 'ok' });
    const route = routes.find((candidate) => candidate.method === request.method && candidate.pattern.test(url.pathname));
    if (!route) return sendJson(response, 404, { error: 'Route not found' });
    const body = ['POST', 'PATCH', 'PUT'].includes(request.method) ? await readBody(request) : {};
    const result = await route.handler({ body, params: {} }, url.pathname.match(route.pattern));
    const isCreate = request.method === 'POST' && url.pathname === '/customers' || request.method === 'POST' && url.pathname.endsWith('/addresses');
    return sendJson(response, isCreate ? 201 : 200, result);
  } catch (error) {
    response.setHeader('Content-Type', 'application/json');
    errorHandler(error, response);
  }
});

server.listen(port, () => console.log(`${serviceName} listening on port ${port}`));

module.exports = server;
