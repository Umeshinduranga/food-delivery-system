function createDeliveryRoutes(controller) {
  return [
    { method: 'POST', pattern: /^\/deliveries$/, handler: (request) => controller.create(request) },
    { method: 'GET', pattern: /^\/deliveries\/([^/]+)$/, handler: (request, match) => controller.getById({ ...request, params: { deliveryId: match[1] } }) },
    { method: 'GET', pattern: /^\/delivery-persons\/([^/]+)\/deliveries$/, handler: (request, match) => controller.getByPerson({ ...request, params: { deliveryPersonId: match[1] } }) },
    { method: 'PATCH', pattern: /^\/deliveries\/([^/]+)\/assign$/, handler: (request, match) => controller.assign({ ...request, params: { deliveryId: match[1] } }) },
    { method: 'PATCH', pattern: /^\/deliveries\/([^/]+)\/status$/, handler: (request, match) => controller.updateStatus({ ...request, params: { deliveryId: match[1] } }) }
  ];
}

module.exports = { createDeliveryRoutes };