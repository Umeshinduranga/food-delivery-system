require('dotenv').config();

const express = require('express');
const restaurantRoutes = require('./routes/restaurant.routes');
const menuRoutes = require('./routes/menu.routes');

const app = express();
const port = Number(process.env.PORT || 5002);

app.use(express.json());
app.get('/health', (request, response) => {
  response.json({ service: 'restaurant-service', status: 'ok' });
});
app.use('/api/restaurants', restaurantRoutes);
app.use('/api', menuRoutes);

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({ error: 'Request body must be valid JSON' });
  }

  console.error(error);
  return response.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`restaurant-service listening on port ${port}`);
});
