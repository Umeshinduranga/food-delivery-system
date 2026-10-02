const RESTAURANT_STATUSES = Object.freeze([
  'ACTIVE',
  'INACTIVE',
  'OPEN',
  'CLOSED',
]);

function toPublicRestaurant(restaurant) {
  return { ...restaurant };
}

module.exports = { RESTAURANT_STATUSES, toPublicRestaurant };
