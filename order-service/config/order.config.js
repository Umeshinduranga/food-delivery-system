module.exports = {
  port: Number(process.env.PORT || 5003),
  serviceName: process.env.SERVICE_NAME || 'order-service',
  deliveryFee: Number(process.env.DELIVERY_FEE || 300)
};