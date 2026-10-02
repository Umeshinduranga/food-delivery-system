const { randomUUID } = require('node:crypto');

const restaurants = new Map();

function create(data) {
  const now = new Date().toISOString();
  const restaurant = {
    id: randomUUID(),
    name: data.name,
    description: data.description || '',
    address: data.address,
    contactNumber: data.contactNumber,
    email: data.email,
    cuisineType: data.cuisineType,
    openingTime: data.openingTime,
    closingTime: data.closingTime,
    status: data.status,
    ownerUserId: data.ownerUserId,
    createdAt: now,
    updatedAt: now,
  };

  restaurants.set(restaurant.id, restaurant);
  return restaurant;
}

function findAll(filters = {}) {
  return [...restaurants.values()].filter((restaurant) => {
    return (!filters.status || restaurant.status === filters.status)
      && (!filters.ownerUserId || restaurant.ownerUserId === filters.ownerUserId);
  });
}

function findById(id) {
  return restaurants.get(id);
}

function update(id, changes) {
  const restaurant = restaurants.get(id);
  if (!restaurant) {
    return undefined;
  }

  Object.assign(restaurant, changes, { updatedAt: new Date().toISOString() });
  return restaurant;
}

module.exports = { create, findAll, findById, update };
