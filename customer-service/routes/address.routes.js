function createAddressRoutes(controller) {
  return [
    { method: 'POST', pattern: /^\/customers\/([^/]+)\/addresses$/, handler: (request, match) => controller.create({ ...request, params: { customerId: match[1] } }) },
    { method: 'GET', pattern: /^\/customers\/([^/]+)\/addresses$/, handler: (request, match) => controller.list({ ...request, params: { customerId: match[1] } }) },
    { method: 'GET', pattern: /^\/addresses\/([^/]+)$/, handler: (request, match) => controller.getById({ ...request, params: { addressId: match[1] } }) },
    { method: 'PATCH', pattern: /^\/addresses\/([^/]+)$/, handler: (request, match) => controller.update({ ...request, params: { addressId: match[1] } }) },
    { method: 'PUT', pattern: /^\/addresses\/([^/]+)\/default$/, handler: (request, match) => controller.setDefault({ ...request, params: { addressId: match[1] } }) },
    { method: 'DELETE', pattern: /^\/addresses\/([^/]+)$/, handler: (request, match) => controller.remove({ ...request, params: { addressId: match[1] } }) }
  ];
}

module.exports = { createAddressRoutes };