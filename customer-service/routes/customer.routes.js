function createCustomerRoutes(controller) {
  return [
    { method: 'POST', pattern: /^\/customers$/, handler: (request) => controller.create(request) },
    { method: 'GET', pattern: /^\/customers\/([^/]+)$/, handler: (request, match) => controller.getById({ ...request, params: { customerId: match[1] } }) },
    { method: 'PATCH', pattern: /^\/customers\/([^/]+)$/, handler: (request, match) => controller.update({ ...request, params: { customerId: match[1] } }) },
    { method: 'DELETE', pattern: /^\/customers\/([^/]+)$/, handler: (request, match) => controller.remove({ ...request, params: { customerId: match[1] } }) }
  ];
}

module.exports = { createCustomerRoutes };