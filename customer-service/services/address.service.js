const { createAddress } = require('../models/address.model');
const { AppError } = require('../utils/errors');
const { requireText } = require('./customer.service');

function optionalCoordinate(value, fieldName) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new AppError(400, `${fieldName} must be a number`);
  return value;
}

class AddressService {
  constructor(addressRepository, customerRepository) {
    this.addressRepository = addressRepository;
    this.customerRepository = customerRepository;
  }

  getCustomer(customerId) {
    const customer = this.customerRepository.findById(requireText(customerId, 'customerId'));
    if (!customer) throw new AppError(404, 'Customer not found');
    return customer;
  }

  listAddresses(customerId) {
    this.getCustomer(customerId);
    return this.addressRepository.findByCustomerId(customerId);
  }

  createAddress(customerId, payload = {}) {
    this.getCustomer(customerId);
    const addressName = requireText(payload.addressName, 'addressName');
    if (this.addressRepository.findByCustomerAndName(customerId, addressName)) throw new AppError(409, 'An address with this name already exists');
    const existing = this.addressRepository.findByCustomerId(customerId);
    const address = createAddress({
      customerId,
      addressName,
      addressLine1: requireText(payload.addressLine1, 'addressLine1'),
      addressLine2: payload.addressLine2,
      city: requireText(payload.city, 'city'),
      postalCode: requireText(payload.postalCode, 'postalCode'),
      latitude: optionalCoordinate(payload.latitude, 'latitude'),
      longitude: optionalCoordinate(payload.longitude, 'longitude'),
      isDefault: payload.isDefault || existing.length === 0
    });
    return this.saveWithDefault(address);
  }

  getAddress(addressId) {
    const address = this.addressRepository.findById(requireText(addressId, 'addressId'));
    if (!address) throw new AppError(404, 'Address not found');
    return address;
  }

  updateAddress(addressId, payload = {}) {
    const address = this.getAddress(addressId);
    for (const field of ['addressName', 'addressLine1', 'addressLine2', 'city', 'postalCode']) {
      if (payload[field] !== undefined) address[field] = field === 'addressLine2' ? payload[field] : requireText(payload[field], field);
    }
    if (payload.latitude !== undefined) address.latitude = optionalCoordinate(payload.latitude, 'latitude');
    if (payload.longitude !== undefined) address.longitude = optionalCoordinate(payload.longitude, 'longitude');
    address.updatedDate = new Date().toISOString();
    if (payload.isDefault === true) address.isDefault = true;
    return this.saveWithDefault(address);
  }

  deleteAddress(addressId) {
    const address = this.getAddress(addressId);
    this.addressRepository.delete(address.addressId);
    const remaining = this.addressRepository.findByCustomerId(address.customerId);
    if (address.isDefault && remaining.length > 0) {
      remaining[0].isDefault = true;
      this.addressRepository.update(remaining[0]);
    }
    return { addressId: address.addressId, deleted: true };
  }

  saveWithDefault(address) {
    const addresses = this.addressRepository.findByCustomerId(address.customerId);
    if (address.isDefault) addresses.forEach((item) => { item.isDefault = item.addressId === address.addressId; this.addressRepository.update(item); });
    return this.addressRepository.update(address);
  }
}

module.exports = { AddressService };