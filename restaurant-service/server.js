const http = require('node:http');

const port = Number(process.env.PORT || 3000);
const serviceName = process.env.SERVICE_NAME || 'restaurant-service';

const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify({ service: serviceName, status: 'ok' }));
});

server.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);
});
