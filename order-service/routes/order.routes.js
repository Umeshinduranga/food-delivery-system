function createOrderRoutes(controller) {
  return [
    { method: 'POST', pattern: /^\/orders$/, handler: (request) => controller.create(request) },
    { method: 'GET', pattern: /^\/orders\/([^/]+)$/, handler: (request, match) => controller.getById({ ...request, params: { orderId: match[1] } }) },
    { method: 'GET', pattern: /^\/customers\/([^/]+)\/orders$/, handler: (request, match) => controller.getByCustomer({ ...request, params: { customerId: match[1] } }) },
    { method: 'GET', pattern: /^\/restaurants\/([^/]+)\/orders$/, handler: (request, match) => controller.getByRestaurant({ ...request, params: { restaurantId: match[1] } }) },
    { method: 'PATCH', pattern: /^\/orders\/([^/]+)\/status$/, handler: (request, match) => controller.updateStatus({ ...request, params: { orderId: match[1] } }) },
    { method: 'POST', pattern: /^\/orders\/([^/]+)\/cancel$/, handler: (request, match) => controller.cancel({ ...request, params: { orderId: match[1] } }) }
  ];
}

module.exports = { createOrderRoutes };