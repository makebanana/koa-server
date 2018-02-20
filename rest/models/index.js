// const Auth = require('./system/auth.model');
const Customer = require('./customer/customer.model');
const Manager = require('./manager/manager.model');
const Auth = require('./system/auth.model');
const Photo = require('./photo/photo.model');
const PhotoType = require('./photo/type.model');

module.exports = {
  Auth,
  Manager,
  Customer,
  Photo,
  PhotoType
};
