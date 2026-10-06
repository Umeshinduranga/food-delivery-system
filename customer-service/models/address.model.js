const crypto = require('node:crypto');

function createAddress({ customerId, addressName, addressLine1, addressLine2, city, postalCode, latitude, longitude, isDefault }) {
  return {
    addressId: crypto.randomUUID(),
    customerId,
    addressName,
    addressLine1,
    addressLine2: addressLine2 || null,
    city,
    postalCode,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    isDefault: Boolean(isDefault),
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
  };
}

module.exports = { createAddress };