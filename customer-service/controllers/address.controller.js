class AddressController {
  constructor(addressService) {
    this.addressService = addressService;
  }

  create(request) { return this.addressService.createAddress(request.params.customerId, request.body); }
  list(request) { return this.addressService.listAddresses(request.params.customerId); }
  getById(request) { return this.addressService.getAddress(request.params.addressId); }
  update(request) { return this.addressService.updateAddress(request.params.addressId, request.body); }
  setDefault(request) { return this.addressService.updateAddress(request.params.addressId, { isDefault: true }); }
  remove(request) { return this.addressService.deleteAddress(request.params.addressId); }
}

module.exports = AddressController;