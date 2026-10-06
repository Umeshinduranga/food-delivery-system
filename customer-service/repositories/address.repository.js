class AddressRepository {
  constructor() {
    this.addresses = new Map();
  }

  create(address) {
    this.addresses.set(address.addressId, address);
    return address;
  }

  findById(addressId) {
    return this.addresses.get(addressId) || null;
  }

  findByCustomerId(customerId) {
    return Array.from(this.addresses.values()).filter((address) => address.customerId === customerId);
  }

  findByCustomerAndName(customerId, addressName) {
    return this.findByCustomerId(customerId).find((address) => address.addressName === addressName) || null;
  }

  update(address) {
    this.addresses.set(address.addressId, address);
    return address;
  }

  delete(addressId) {
    return this.addresses.delete(addressId);
  }

  deleteByCustomerId(customerId) {
    this.findByCustomerId(customerId).forEach((address) => this.delete(address.addressId));
  }
}

module.exports = AddressRepository;