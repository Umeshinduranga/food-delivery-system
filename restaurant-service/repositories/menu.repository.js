const { randomUUID } = require('node:crypto');

const menuItems = new Map();

function create(data) {
  const now = new Date().toISOString();
  const item = {
    id: randomUUID(),
    restaurantId: data.restaurantId,
    itemName: data.itemName,
    description: data.description || '',
    category: data.category,
    price: data.price,
    availability: data.availability,
    imageUrl: data.imageUrl || '',
    createdAt: now,
    updatedAt: now,
  };

  menuItems.set(item.id, item);
  return item;
}

function findById(id) {
  return menuItems.get(id);
}

function findByRestaurantId(restaurantId) {
  return [...menuItems.values()].filter((item) => item.restaurantId === restaurantId);
}

function update(id, changes) {
  const item = menuItems.get(id);
  if (!item) {
    return undefined;
  }

  Object.assign(item, changes, { updatedAt: new Date().toISOString() });
  return item;
}

function remove(id) {
  return menuItems.delete(id);
}

module.exports = { create, findById, findByRestaurantId, remove, update };
