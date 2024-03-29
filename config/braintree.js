const braintree = require("braintree");
const config = require("./config");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: config.BRAINTREE_MERCHANT_ID,
  publicKey: config.BRAINTREE_PUBLIC_KEY,
  privateKey: config.BRAINTREE_PRIVATE_KEY,
});

module.exports = gateway;
