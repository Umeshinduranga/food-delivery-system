const { createDelivery } = require('../models/delivery.model');
const { AppError } = require('../utils/errors');

const DELIVERY_STATUSES = [
  'PENDING',
  'ASSIGNED',
  'PICKUP_PENDING',
  'PICKED_UP',
  'ON_THE_WAY',
  'DELIVERED',
  'FAILED',
  'CANCELLED'
];

const STATUS_TRANSITIONS = {
  PENDING: ['ASSIGNED', 'FAILED', 'CANCELLED'],
  ASSIGNED: ['PICKUP_PENDING', 'FAILED', 'CANCELLED'],
  PICKUP_PENDING: ['PICKED_UP', 'FAILED', 'CANCELLED'],
  PICKED_UP: ['ON_THE_WAY', 'FAILED'],
  ON_THE_WAY: ['DELIVERED', 'FAILED'],
  DELIVERED: [],
  FAILED: [],
  CANCELLED: []
};

function requireText(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(400, `${fieldName} is required`);
  }
  return value.trim();
}

class DeliveryService {
  constructor(repository) {
    this.repository = repository;
  }

  createDelivery(payload = {}) {
    const orderId = requireText(payload.orderId, 'orderId');
    if (this.repository.findByOrderId(orderId)) {
      throw new AppError(409, 'A delivery already exists for this order');
    }

    if (payload.orderStatus && !['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(payload.orderStatus)) {
      throw new AppError(400, 'Delivery can only be created for a confirmed or preparing order');
    }

    return this.repository.create(createDelivery({
      orderId,
      restaurantId: requireText(payload.restaurantId, 'restaurantId'),
      customerId: requireText(payload.customerId, 'customerId'),
      pickupAddress: requireText(payload.pickupAddress, 'pickupAddress'),
      deliveryAddress: requireText(payload.deliveryAddress, 'deliveryAddress')
    }));
  }

  getDelivery(deliveryId) {
    const delivery = this.repository.findById(requireText(deliveryId, 'deliveryId'));
    if (!delivery) throw new AppError(404, 'Delivery not found');
    return delivery;
  }

  getDeliveriesForPerson(deliveryPersonId) {
    return this.repository.findByDeliveryPersonId(requireText(deliveryPersonId, 'deliveryPersonId'));
  }

  assignDelivery(deliveryId, deliveryPersonId) {
    const delivery = this.getDelivery(deliveryId);
    if (!['PENDING', 'ASSIGNED'].includes(delivery.status)) {
      throw new AppError(409, `Cannot assign a delivery in ${delivery.status} status`);
    }
    delivery.deliveryPersonId = requireText(deliveryPersonId, 'deliveryPersonId');
    delivery.status = 'ASSIGNED';
    delivery.assignedTime = delivery.assignedTime || new Date().toISOString();
    delivery.updatedTime = new Date().toISOString();
    return this.repository.update(delivery);
  }

  updateStatus(deliveryId, nextStatus) {
    const delivery = this.getDelivery(deliveryId);
    if (!DELIVERY_STATUSES.includes(nextStatus)) {
      throw new AppError(400, `status must be one of: ${DELIVERY_STATUSES.join(', ')}`);
    }
    if (!STATUS_TRANSITIONS[delivery.status].includes(nextStatus)) {
      throw new AppError(409, `Cannot move delivery from ${delivery.status} to ${nextStatus}`);
    }
    if (nextStatus === 'PICKED_UP' && !delivery.deliveryPersonId) {
      throw new AppError(409, 'A delivery person must be assigned before pickup');
    }
    delivery.status = nextStatus;
    if (nextStatus === 'PICKED_UP') delivery.pickupTime = new Date().toISOString();
    if (nextStatus === 'DELIVERED') delivery.deliveredTime = new Date().toISOString();
    delivery.updatedTime = new Date().toISOString();
    return this.repository.update(delivery);
  }
}

module.exports = { DeliveryService, DELIVERY_STATUSES };