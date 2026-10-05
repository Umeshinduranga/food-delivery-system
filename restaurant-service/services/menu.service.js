const menuRepository = require('../repositories/menu.repository');
const restaurantRepository = require('../repositories/restaurant.repository');
const { toPublicMenuItem } = require('../models/menu.model');
const { serviceError } = require('../utils/errors');

function ensureRestaurant(restaurantId) {
  const restaurant = restaurantRepository.findById(restaurantId);
  if (!restaurant) {
    throw serviceError('Restaurant not found', 404);
  }
  if (restaurant.status === 'INACTIVE') {
    throw serviceError('Inactive restaurants cannot manage menu items', 409);
  }
}

function validateItem(data, partial = false) {
  if (!partial || data.itemName !== undefined) {
    if (typeof data.itemName !== 'string' || !data.itemName.trim()) {
      throw serviceError('itemName is required', 400);
    }
  }
  if (!partial || data.category !== undefined) {
    if (typeof data.category !== 'string' || !data.category.trim()) {
      throw serviceError('category is required', 400);
    }
  }
  if (!partial || data.price !== undefined) {
    if (typeof data.price !== 'number' || data.price < 0) {
      throw serviceError('price must be a non-negative number', 400);
    }
  }
  if (data.availability !== undefined && typeof data.availability !== 'boolean') {
    throw serviceError('availability must be a boolean', 400);
  }
}

function create(restaurantId, data) {
  ensureRestaurant(restaurantId);
  validateItem(data);

  return toPublicMenuItem(menuRepository.create({
    ...data,
    restaurantId,
    itemName: data.itemName.trim(),
    category: data.category.trim(),
    availability: data.availability ?? true,
  }));
}

function list(restaurantId) {
  ensureRestaurant(restaurantId);
  return menuRepository.findByRestaurantId(restaurantId).map(toPublicMenuItem);
}

function categories(restaurantId) {
  return [...new Set(list(restaurantId).map((item) => item.category))].sort();
}

function update(id, data) {
  const item = menuRepository.findById(id);
  if (!item) {
    throw serviceError('Menu item not found', 404);
  }
  ensureRestaurant(item.restaurantId);
  validateItem(data, true);

  const changes = { ...data };
  if (changes.itemName) changes.itemName = changes.itemName.trim();
  if (changes.category) changes.category = changes.category.trim();
  const updatedItem = menuRepository.update(id, changes);
  return toPublicMenuItem(updatedItem);
}

function remove(id) {
  const item = menuRepository.findById(id);
  if (!item) {
    throw serviceError('Menu item not found', 404);
  }
  menuRepository.remove(id);
}

module.exports = { categories, create, list, remove, update };
