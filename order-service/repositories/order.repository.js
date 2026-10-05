class OrderRepository {
  constructor() {
    this.orders = new Map();
  }

  create(order) {
    this.orders.set(order.orderId, order);
    return order;
  }

  findById(orderId) {
    return this.orders.get(orderId) || null;
  }

  findByCustomerId(customerId) {
    return this.findAll().filter((order) => order.customerId === customerId);
  }

  findByRestaurantId(restaurantId) {
    return this.findAll().filter((order) => order.restaurantId === restaurantId);
  }

  findAll() {
    return Array.from(this.orders.values()).sort((first, second) =>
      second.createdDate.localeCompare(first.createdDate)
    );
  }

  update(order) {
    this.orders.set(order.orderId, order);
    return order;
  }
}

module.exports = OrderRepository;