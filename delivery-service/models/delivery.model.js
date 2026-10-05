const crypto = require('node:crypto');

function createDelivery({ orderId, restaurantId, customerId, pickupAddress, deliveryAddress }) {
  const now = new Date().toISOString();
  return {
    deliveryId: crypto.randomUUID(),
    orderId,
    deliveryPersonId: null,
    restaurantId,
    customerId,
    pickupAddress,
    deliveryAddress,
    status: 'PENDING',
    assignedTime: null,
    pickupTime: null,
    deliveredTime: null,
    createdTime: now,
    updatedTime: now
  };
}

module.exports = { createDelivery };