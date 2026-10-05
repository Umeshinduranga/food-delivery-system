class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  create(request) {
    return this.orderService.createOrder(request.body);
  }

  getById(request) {
    return this.orderService.getOrder(request.params.orderId);
  }

  getByCustomer(request) {
    return this.orderService.getCustomerOrders(request.params.customerId);
  }

  getByRestaurant(request) {
    return this.orderService.getRestaurantOrders(request.params.restaurantId);
  }

  updateStatus(request) {
    return this.orderService.updateStatus(request.params.orderId, request.body.orderStatus);
  }

  cancel(request) {
    return this.orderService.cancelOrder(request.params.orderId);
  }
}

module.exports = OrderController;