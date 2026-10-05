class DeliveryRepository {
  constructor() {
    this.deliveries = new Map();
  }

  create(delivery) {
    this.deliveries.set(delivery.deliveryId, delivery);
    return delivery;
  }

  findById(deliveryId) {
    return this.deliveries.get(deliveryId) || null;
  }

  findByOrderId(orderId) {
    return Array.from(this.deliveries.values()).find((delivery) => delivery.orderId === orderId) || null;
  }

  findByDeliveryPersonId(deliveryPersonId) {
    return this.findAll().filter((delivery) => delivery.deliveryPersonId === deliveryPersonId);
  }

  findAll() {
    return Array.from(this.deliveries.values()).sort((first, second) =>
      second.createdTime.localeCompare(first.createdTime)
    );
  }

  update(delivery) {
    this.deliveries.set(delivery.deliveryId, delivery);
    return delivery;
  }
}

module.exports = DeliveryRepository;