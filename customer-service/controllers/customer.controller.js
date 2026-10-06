class CustomerController {
  constructor(customerService) {
    this.customerService = customerService;
  }

  create(request) { return this.customerService.createCustomer(request.body); }
  getById(request) { return this.customerService.getCustomer(request.params.customerId); }
  update(request) { return this.customerService.updateCustomer(request.params.customerId, request.body); }
  remove(request) { return this.customerService.deleteCustomer(request.params.customerId); }
}

module.exports = CustomerController;