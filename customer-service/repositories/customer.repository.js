class CustomerRepository {
  constructor() {
    this.customers = new Map();
  }

  create(customer) {
    this.customers.set(customer.customerId, customer);
    return customer;
  }

  findById(customerId) {
    return this.customers.get(customerId) || null;
  }

  findByUserId(userId) {
    return Array.from(this.customers.values()).find((customer) => customer.userId === userId) || null;
  }

  update(customer) {
    this.customers.set(customer.customerId, customer);
    return customer;
  }

  delete(customerId) {
    return this.customers.delete(customerId);
  }
}

module.exports = CustomerRepository;