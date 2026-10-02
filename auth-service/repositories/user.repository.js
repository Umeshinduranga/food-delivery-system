const { randomUUID } = require('node:crypto');

const users = new Map();

function create(userData) {
  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    name: userData.name,
    email: userData.email,
    passwordHash: userData.passwordHash,
    role: userData.role,
    status: userData.status,
    createdAt: now,
    updatedAt: now,
  };

  users.set(user.id, user);
  return user;
}

function findByEmail(email) {
  return [...users.values()].find((user) => user.email === email);
}

function findById(id) {
  return users.get(id);
}

function updateStatus(id, status) {
  const user = users.get(id);
  if (!user) {
    return undefined;
  }

  user.status = status;
  user.updatedAt = new Date().toISOString();
  return user;
}

module.exports = { create, findByEmail, findById, updateStatus };
