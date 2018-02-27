// const Auth = require('./system/auth.model');
const customer = require('./customer/customer.model');
const manager = require('./manager/manager.model');
const auth = require('./system/auth.model');
const photo = require('./photo/photo.model');
const photoType = require('./photo/type.model');
const image = require('./common/image.model');

module.exports = {
  auth,
  manager,
  customer,
  photo,
  photoType,
  image
};
