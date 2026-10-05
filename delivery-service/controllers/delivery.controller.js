class DeliveryController {
  constructor(deliveryService) {
    this.deliveryService = deliveryService;
  }

  create(request) {
    return this.deliveryService.createDelivery(request.body);
  }

  getById(request) {
    return this.deliveryService.getDelivery(request.params.deliveryId);
  }

  getByPerson(request) {
    return this.deliveryService.getDeliveriesForPerson(request.params.deliveryPersonId);
  }

  assign(request) {
    return this.deliveryService.assignDelivery(request.params.deliveryId, request.body.deliveryPersonId);
  }

  updateStatus(request) {
    return this.deliveryService.updateStatus(request.params.deliveryId, request.body.status);
  }
}

module.exports = DeliveryController;