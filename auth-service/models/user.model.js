const ROLES = Object.freeze([
  'ADMIN',
  'CUSTOMER',
  'RESTAURANT_ADMIN',
  'DELIVERY_PERSON',
]);

const ACCOUNT_STATUSES = Object.freeze(['ACTIVE', 'INACTIVE']);

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

module.exports = { ACCOUNT_STATUSES, ROLES, toPublicUser };
