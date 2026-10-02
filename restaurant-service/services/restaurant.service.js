const restaurantRepository = require('../repositories/restaurant.repository');
const {
  RESTAURANT_STATUSES,
  toPublicRestaurant,
} = require('../models/restaurant.model');
const { serviceError } = require('../utils/errors');

const requiredFields = [
  'name',
  'address',
  'contactNumber',
  'email',
  'cuisineType',
  'openingTime',
  'closingTime',
  'ownerUserId',
];

function validateFields(data, fields = requiredFields) {
  for (const field of fields) {
    if (typeof data[field] !== 'string' || !data[field].trim()) {
      throw serviceError(`${field} is required`, 400);
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw serviceError('A valid restaurant email is required', 400);
  }
}

function validateStatus(status) {
  if (status !== undefined && !RESTAURANT_STATUSES.includes(status)) {
    throw serviceError(`Status must be one of: ${RESTAURANT_STATUSES.join(', ')}`, 400);
  }
}

function create(data) {
  validateFields(data);
  validateStatus(data.status);

  const restaurant = restaurantRepository.create({
    ...data,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    status: data.status || 'ACTIVE',
  });
  return toPublicRestaurant(restaurant);
}

function list(filters) {
  validateStatus(filters.status);
  return restaurantRepository.findAll(filters).map(toPublicRestaurant);
}

function getById(id) {
  const restaurant = restaurantRepository.findById(id);
  if (!restaurant) {
    throw serviceError('Restaurant not found', 404);
  }
  return toPublicRestaurant(restaurant);
}

function update(id, data) {
  const allowedFields = [
    'name',
    'description',
    'address',
    'contactNumber',
    'email',
    'cuisineType',
    'openingTime',
    'closingTime',
    'status',
    'ownerUserId',
  ];
  const changes = Object.fromEntries(
    Object.entries(data).filter(([field]) => allowedFields.includes(field)),
  );

  if (changes.email) {
    changes.email = changes.email.trim().toLowerCase();
  }
  if (changes.name) {
    changes.name = changes.name.trim();
  }
  validateStatus(changes.status);
  if (Object.keys(changes).length === 0) {
    throw serviceError('At least one restaurant field is required', 400);
  }

  const restaurant = restaurantRepository.update(id, changes);
  if (!restaurant) {
    throw serviceError('Restaurant not found', 404);
  }
  return toPublicRestaurant(restaurant);
}

function deactivate(id) {
  return update(id, { status: 'INACTIVE' });
}

module.exports = { create, deactivate, getById, list, update };
