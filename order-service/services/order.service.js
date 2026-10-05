const crypto = require('node:crypto');

const { createOrder } = require('../models/order.model');
const { createOrderItem } = require('../models/order-item.model');
const { AppError } = require('../utils/errors');

const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'PICKED_UP',
  'ON_THE_WAY',
  'DELIVERED',
  'CANCELLED'
];

const STATUS_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['PICKED_UP'],
  PICKED_UP: ['ON_THE_WAY'],
  ON_THE_WAY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: []
};

function roundMoney(value) {
  return Number(value.toFixed(2));
}

function requireText(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(400, `${fieldName} is required`);
  }
  return value.trim();
}

function requireMoney(value, fieldName) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new AppError(400, `${fieldName} must be a non-negative number`);
  }
  return roundMoney(value);
}

class OrderService {
  constructor(repository, deliveryFee) {
    this.repository = repository;
    this.deliveryFee = requireMoney(deliveryFee, 'deliveryFee');
  }

  createOrder(payload = {}) {
    const customerId = requireText(payload.customerId, 'customerId');
    const restaurantId = requireText(payload.restaurantId, 'restaurantId');
    const deliveryAddress = requireText(payload.deliveryAddress, 'deliveryAddress');

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      throw new AppError(400, 'items must contain at least one food item');
    }

    const orderId = requireText(crypto.randomUUID(), 'orderId');
    const items = payload.items.map((item) => {
      const menuItemId = requireText(item.menuItemId, 'menuItemId');
      const itemName = requireText(item.itemName, 'itemName');
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new AppError(400, 'quantity must be a positive integer');
      }
      const unitPrice = requireMoney(item.unitPrice, 'unitPrice');
      return createOrderItem({ orderId, menuItemId, itemName, quantity: item.quantity, unitPrice });
    });

    const subtotal = roundMoney(items.reduce((sum, item) => sum + item.totalPrice, 0));
    const order = createOrder({
      customerId,
      restaurantId,
      deliveryAddress,
      items,
      subtotal,
      deliveryFee: this.deliveryFee,
      totalAmount: roundMoney(subtotal + this.deliveryFee)
    });
    order.orderId = orderId;
    items.forEach((item) => { item.orderId = orderId; });

    return this.repository.create(order);
  }

  getOrder(orderId) {
    const order = this.repository.findById(requireText(orderId, 'orderId'));
    if (!order) throw new AppError(404, 'Order not found');
    return order;
  }

  getCustomerOrders(customerId) {
    return this.repository.findByCustomerId(requireText(customerId, 'customerId'));
  }

  getRestaurantOrders(restaurantId) {
    return this.repository.findByRestaurantId(requireText(restaurantId, 'restaurantId'));
  }

  updateStatus(orderId, nextStatus) {
    const order = this.getOrder(orderId);
    if (!ORDER_STATUSES.includes(nextStatus)) {
      throw new AppError(400, `orderStatus must be one of: ${ORDER_STATUSES.join(', ')}`);
    }
    if (!STATUS_TRANSITIONS[order.orderStatus].includes(nextStatus)) {
      throw new AppError(409, `Cannot move order from ${order.orderStatus} to ${nextStatus}`);
    }
    order.orderStatus = nextStatus;
    order.updatedDate = new Date().toISOString();
    return this.repository.update(order);
  }

  cancelOrder(orderId) {
    return this.updateStatus(orderId, 'CANCELLED');
  }
}

module.exports = { OrderService, ORDER_STATUSES };