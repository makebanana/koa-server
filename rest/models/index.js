const playRecord = require('./customer/playRecord.model');
const customer = require('./customer/customer.model');
const manager = require('./manager/manager.model');
const auth = require('./system/auth.model');
const photo = require('./photo/photo.model');
const photoType = require('./photo/photoType.model');
const image = require('./common/image.model');

module.exports = {
  auth,
  manager,
  customer,
  playRecord,
  photo,
  photoType,
  image
};
