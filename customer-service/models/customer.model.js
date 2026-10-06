const crypto = require('node:crypto');

function createCustomer({ userId, firstName, lastName, phoneNumber, profileImage, status }) {
  const now = new Date().toISOString();
  return {
    customerId: crypto.randomUUID(),
    userId,
    firstName,
    lastName,
    phoneNumber,
    profileImage: profileImage || null,
    status: status || 'ACTIVE',
    createdDate: now,
    updatedDate: now
  };
}

module.exports = { createCustomer };