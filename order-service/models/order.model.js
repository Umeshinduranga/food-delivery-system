const crypto = require('node:crypto');

function createOrder({ customerId, restaurantId, deliveryAddress, items, subtotal, deliveryFee, totalAmount }) {
  const now = new Date().toISOString();

  return {
    orderId: crypto.randomUUID(),
    customerId,
    restaurantId,
    deliveryAddress,
    subtotal,
    deliveryFee,
    totalAmount,
    orderStatus: 'PENDING',
    createdDate: now,
    updatedDate: now,
    items
  };
}

module.exports = { createOrder };