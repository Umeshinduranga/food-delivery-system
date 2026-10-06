const { createCustomer } = require('../models/customer.model');
const { AppError } = require('../utils/errors');

function requireText(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') throw new AppError(400, `${fieldName} is required`);
  return value.trim();
}

class CustomerService {
  constructor(customerRepository, addressRepository) {
    this.customerRepository = customerRepository;
    this.addressRepository = addressRepository;
  }

  createCustomer(payload = {}) {
    const userId = requireText(payload.userId, 'userId');
    if (this.customerRepository.findByUserId(userId)) throw new AppError(409, 'A customer profile already exists for this userId');
    const status = payload.status || 'ACTIVE';
    if (!['ACTIVE', 'INACTIVE'].includes(status)) throw new AppError(400, 'status must be ACTIVE or INACTIVE');
    return this.customerRepository.create(createCustomer({
      userId,
      firstName: requireText(payload.firstName, 'firstName'),
      lastName: requireText(payload.lastName, 'lastName'),
      phoneNumber: requireText(payload.phoneNumber, 'phoneNumber'),
      profileImage: payload.profileImage,
      status
    }));
  }

  getCustomer(customerId) {
    const customer = this.customerRepository.findById(requireText(customerId, 'customerId'));
    if (!customer) throw new AppError(404, 'Customer not found');
    return customer;
  }

  updateCustomer(customerId, payload = {}) {
    const customer = this.getCustomer(customerId);
    for (const field of ['firstName', 'lastName', 'phoneNumber', 'profileImage']) {
      if (payload[field] !== undefined) customer[field] = field === 'profileImage' ? payload[field] : requireText(payload[field], field);
    }
    if (payload.status !== undefined) {
      if (!['ACTIVE', 'INACTIVE'].includes(payload.status)) throw new AppError(400, 'status must be ACTIVE or INACTIVE');
      customer.status = payload.status;
    }
    customer.updatedDate = new Date().toISOString();
    return this.customerRepository.update(customer);
  }

  deleteCustomer(customerId) {
    const customer = this.getCustomer(customerId);
    this.addressRepository.deleteByCustomerId(customer.customerId);
    this.customerRepository.delete(customer.customerId);
    return { customerId: customer.customerId, deleted: true };
  }
}

module.exports = { CustomerService, requireText };