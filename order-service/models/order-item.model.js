const crypto = require('node:crypto');

function createOrderItem({ orderId, menuItemId, itemName, quantity, unitPrice }) {
  return {
    orderItemId: crypto.randomUUID(),
    orderId,
    menuItemId,
    itemName,
    quantity,
    unitPrice,
    totalPrice: Number((quantity * unitPrice).toFixed(2))
  };
}

module.exports = { createOrderItem };